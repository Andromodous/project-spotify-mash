import functions_framework
import base64
import json
import resend
import os
from datetime import datetime

@functions_framework.http
def handler(request) -> str:

    try:
        # print(request.data)
        data = json.loads(request.data)
        print(data)

        email, artist = data['userId'], data['artist']
        resend.api_key = os.getenv("RESEND_API", "RESEND_API")

        month = datetime.now().strftime("%B")

        params: resend.Emails.SendParams = {
            "from": os.getenv('EMAIL_SOURCE', 'YOUR EMAIL SOURCE'),
            "to": [email],
            "subject": f"Thanks for being part of {month}'s poll | Music Mash",
            "html": f"<body><p style='font-size:140%;'>You voted for <b>{artist}</b> in the music-mash {month} poll.</p><br /></br />" + 
            f"<p>To view the current leaderboard <a href='{os.getenv('FRONTEND_RESOURCE', 'localhost:3000')}'>visit</a>. </p>" +
            "<p style='color:lightgrey;'>If you wish to unsubscribe from future communications via email "
            + f"click <a href='{os.getenv('FRONTEND_RESOURCE', 'localhost:3000')}?userId={email}&action=FALSE'>here</a></p></body>",
        }

        r = resend.Emails.send(params)
        return 'Sucessfully processed', 200
    except Exception as error:
        return f'Error, something went wrong {error}', 500
