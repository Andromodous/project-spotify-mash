import functions_framework
import redis
import json
from datetime import datetime as x
import os


@functions_framework.http
def handler(request) -> str:
    print("starting function")
    try:
        r = redis.Redis(
            host=os.getenv("REDIS_HOST_NAME", "redis"),
            port=os.getenv("REDIS_PORT_NUMBER", 6379),
            password=os.getenv('REDIS_PASSWORD', '')
        )  # username #password
        if r and r.ping():
            print("Connected to Redis server")
        else:
            print("Failed to connect to Redis server")
            return "unable to connect from cloud function"

        # timestamp for end date of next month at 12:30
        # value end date in string

        date = x.now()  # get current date
        curDate = date
        month = (date.month + 1) % 13
        year = date.year + 1 if month == 0 else date.year  # convert year
        month = 1 if month == 0 else month  # convert month
        nextMonth = x(year, month, 28, 12, 30)  # expiry date for next month
        pipe = r.pipeline(transaction=True)

        pipe.set(   #set expiry date for new poll
            name="artists:leaderboard:expire",
            value=int(nextMonth.timestamp()),
            exat=int(nextMonth.timestamp())
        )
        print(f"the timestamp is {int(nextMonth.timestamp())}")
        pipe.zpopmax(name="leaderboard")  # retrieve the member with highest score
        pipe.zremrangebyrank(
            name="leaderboard", min=0, max=-1
        )  # remove all members and make empty
        pipe.zadd("leaderboard", {"empty": 0})
        pipe.delete("artists:leaderboard:voted")
        pipe.sadd("artists:leaderboard:voted", "empty")
        res = pipe.execute()

        print(res)
        if res[1]:
            member, score = res[1].pop()  # member returns bytes instead of string
            decoded = member.decode("utf-8")  # decode binary format to string

            if score and member != "empty":
                winner = {
                    "artist": decoded,
                    "votes": int(score),
                    "poll_date": curDate.strftime(
                        "%d-%m-%Y"
                    ),  # format the date into dd-mm-yyyy
                }
                print(json.dumps(winner))
                r.lpush("artists:leaderboard:past", json.dumps(winner))
                x = r.llen("artists:leaderboard:past")
                if x > 5:
                    r.rpop("artists:leaderboard:past")
                
    except:
        return 'Error, something went wrong'
    finally:
        if r:
            r.quit()
            print("quit redis client")

    return "Sucess"
