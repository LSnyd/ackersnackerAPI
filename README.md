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
      "farmName": "WeddingRüben",
      "firstName": "Friedrich",
      "secondName": "Schneider",
      "street": "Müllerstraße",
      "streetNumber": 122,
      "city": "Berlin",
      "place": "13353",
      "longitude": 13.361164093017578,
      "latitude": 52.54517364501953
}
```

#### POST /createTask
Creates task in database of server

payload: 

```json
{    
     "farmName": "WeddingRüben",
     "id": "3487adb3-7c29-4f4d-53ce-ac211d1be734",
     "veggieTitle": "Kartoffeln",
     "date": "24.03.2020",
     "time": "10-16",
     "availableSlots": "9",
     "strain": "Schwer",
     "transport": "SBahn",
     "salary": "14"
}

```

#### POST /query 

Query all results for certain value in table 


payload: 

```json
{    "table": "task", 
     "attribute": "farmName", 
     "value": "WeddingRüben"
}

```

#### GET /getFarms

Returns all farms in database 


#### GET /getTasks

Returns all tasks in database 


#### GET /cleanDB

Deletes all data from DB 


#### GET /fillDB

Fills DB with 3 default farmes and 2 tasks per farmer 
