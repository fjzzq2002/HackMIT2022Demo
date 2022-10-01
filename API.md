/api/login: (req, res): 

​		Input: req.query.username, req.query.password

​		Effect: If match, will login (store in cookie)

/api/createUser: 

​		Input: req.query.username, req.query.password

​		Effect: return "username already exists" or "Created user successfully"

/api/getInfo:

​		Input: req.query.username

​		Output: {coins: number, lastUpdate: date, articles: [{article: Number, cost: Number, shared: Boolean}]}

​					**Article**: the id of artical

​					**Cost: =1 if you bought it, =0 if it was shared with you, =-1 if it was written by you**

​					**Shared: =1** **if you've shared it with others (or it was shared with you) **, =0 if haven't & cost=1

/api/list:

​		Input: None

​		Output: [{article: number, title: string, description: string, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date}]

/api/post:

​		Input: req.query.title, req.query.content, req.query.description

​		Effect: will post the article

/api/buy:

​		Input: req.query.id

​		Effect: will buy the article

/api/fetch:

​		Input: req.query.id

​		Output: {article: number, title: string,  description: string, **content: string**, votes: {upvotes: number, downvotes: number, clicks: number}, author:string, time: date}

​		