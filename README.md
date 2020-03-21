# ackersnackerAPI
WirvsVirus2020

### Pre-requisites

```shell
yarn 
```

### Usage


```shell
yarn start-dev
```

API is running on http://localhost:5000 


### API Description


#### POST /createFarm
Creates farm in database of server

payload: 

```json
{ 
    "farm":"WeddingRüben",
    "farmer":"Ka Rotte",
    "email":"weddingrueben@gmail.de",
    "phone":"02080/8627",
    "street":"Rübenweg 5", 
    "city":"Berlin" 
}
```

#### POST /createTask
Creates task in database of server

payload: 

```json
{    "farm":"WeddingRüben",
     "good":"Spargel",
     "spots":4,
     "date":"23.03.2020",
     "burden":"schwer",
     "transport":"Abholdienst"
}

```
#### Get /getFarms

Returns all farms in database 


#### Get /getTasks

Returns all tasks in database 

