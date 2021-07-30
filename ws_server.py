#!/usr/bin/env python

# WS server example that synchronizes state across clients

import asyncio
import json
import logging
import websockets
import time
import re, random, ast

logging.basicConfig()

ROLL_LOG = {"text": ''}

USERS = set()


def roll_log_event():
    return json.dumps({"type": "roll_log", **ROLL_LOG})


def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})


async def notify_roll_log():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = roll_log_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def notify_users():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        await websocket.send(roll_log_event())
        async for message in websocket:
            data = json.loads(message)
            if data["name"] and data["rolltext"]:
                if data["rolltext"] != 'clear':
                    calc_text = roll_dice(data["rolltext"])
                    if calc_text:
                        ROLL_LOG["text"] = "%s %s%s<br>%s" % (time.strftime("%H:%M:%S", time.localtime()), data["name"], calc_text, ROLL_LOG["text"])
                        await notify_roll_log()
                else:
                    ROLL_LOG["text"] = '已清屏'
                    await notify_roll_log()
            else:
                logging.error("unsupported event: {}", data)
    finally:
        await unregister(websocket)


# 下面是投骰子的方法
def roll_dice(original_text):
    try:
        # 正则为 0到2位数字+d+1到3位数字
        dice_location = re.search(r'[0-9]{0,2}[dD][0-9]{1,3}', original_text).span()
        dice_text = original_text[dice_location[0]:dice_location[1]]
        # 获取骰子数和骰面
        dice_text_split = re.split(r'[dD]', dice_text)
        if dice_text_split[0]:
            dice_count = int(dice_text_split[0])
        else:
            dice_count = 1
        dice_face = int(dice_text_split[1])
        # 投骰子
        roll_result = 0
        for i in range(0, dice_count):
            roll_result += random.randint(1, dice_face)
        # 计算调整结果
        modifier_text = ''
        remain_text = original_text[dice_location[1]:]
        while remain_text:
            target_loction_re = re.match(r'[\+\-\*\/][0-9]{1,6}', remain_text)
            if target_loction_re:
                target_loction = target_loction_re.span()
                modifier_text = '%s%s' % (modifier_text, remain_text[:target_loction[1]])
                remain_text = remain_text[target_loction[1]:]
            else:
                break
        modifier_result = ast.literal_eval(modifier_text) if modifier_text else 0
        total = roll_result + modifier_result
        # 生成输出文档
        before_text = original_text[:dice_location[0]]
        after_text = original_text[dice_location[1]+len(modifier_text):]
        calc_text = '%s{%d}%s= %d' % (dice_text, roll_result, modifier_text, total)
        out_text = '%s %s %s' % (before_text, calc_text, after_text)
        return out_text
    except:
        return


start_server = websockets.serve(counter, "localhost", 6789)
print('开始')
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
