# TwitterAnalytics
Gives basics analytics about twitter accounts including:
- average Retweets per post
- What percentage of tweets a user makes at each hour of the day
- How many retweets a user's posts get on average depending on time of day

###Dependencies
- A running php server
- [Charts.js (Version 1)](https://github.com/nnnick/Chart.js/)
- jquery
- [twitteroauth php library](https://github.com/abraham/twitteroauth)

###Use
- Fill out authinfo.json with your twitter API keys/secrets
- Access analytics.html to use
- analytics.php and will return an array of JSON objects representing tweets for a user. Each object has fields time (UNIX timestamp) and retweets (retween count for corresponding tweet). Required Parameters: handle, tweetMultiplier (integer from 1-15, a higher number will return more tweets).
