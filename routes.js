const Policy = require('./models/policy');
const Meeting = require('./models/meeting');
const Call = require('./models/call');

module.exports=(app)=>{

    app.get('/health', (req, res)=> {
        console.log('health');
        res.send({success:1});
    });

    app.post('/addPolicy', async (req, res) => {
        try {
            let {salesManId, status} = req.body;
            let policy = new Policy();
            policy.salesManId = salesManId;
            policy.status = status;
            await policy.save();
            res.send({success:1, message: 'added pollicy'})
        } catch (err) {
            console.log('err in addPolicy ', err);
            res.status(500).send({success:0});
        }
    });
    
    app.post('/addMeeting', async (req, res) =>{
        try {
            let {salesManId, status} = req.body;
            let meeting = new Meeting();
            meeting.salesManId = salesManId;
            meeting.status = status;
            await meeting.save();
            res.send({success:1, message: 'added meeting'})
        } catch (err) {
            console.log('err in addMeeting ', err);
            res.status(500).send({success:0});
        }
    });
    
    app.post('/addCall', async (req, res) =>{
        try {
            let {salesManId, status} = req.body;
            let call = new Call();
            call.salesManId = salesManId;
            call.status = status;
            await call.save();
            res.send({success:1, message: 'added calls'})
        } catch (err) {
            console.log('err in addCall ', err);
            res.status(500).send({success:0});
        }
    });

    app.get('/getGoodSalesMan', async(req, res) => {
        try {
            let { type } = req.query;
            let data = null;
            if(type == "all") {
                data = await getAllSum();
            } else if(type == "policy") {
                data = await getGoodSalesMan(Policy);
            } else if(type == "meeting") {
                data = await getGoodSalesMan(Meeting);
            } else if(type == "call") {
                data = await getGoodSalesMan(Call);
            }
            res.send({type, data});
        } catch (err) {
            console.log('err in getGoodSalesMan', err);
            res.status(500).send({success:0})
        }
    });

}

function getGoodSalesMan(model) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await model.aggregate([
                {
                    $match: {
                        "status":"complete",
                        "createdAt":{
                            $gt:new Date(new Date().setDate(1)),
                            $lt:new Date()
                        }
                    }  
                  },
                  {
                      $group: {
                          "_id": "$salesManId",
                          "count":{$sum:1}
                      }
                  },
                  {
                      $sort:{
                          "count":-1
                      }
                  },
                  {
                      $limit:1
                  }
            ]);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function getTotalSum(model, point) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await model.aggregate([
                {
                    $match: {
                        "status":"complete",
                        "createdAt":{
                            $gt:new Date(new Date().setDate(1)),
                            $lt:new Date()
                        }
                    }  
                  },
                  {
                      $group: {
                          "_id": "$salesManId",
                          "count":{$sum:1}
                      }
                  },
                  {
                      $project: {
                          "_id":1,
                          "total":{
                              $multiply:["$count", point]
                          }
                      }
                  }
            ]);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

const combinedItems = (arr = []) => {
    const res = arr.reduce((acc, obj) => {
       let found = false;
       for (let i = 0; i < acc.length; i++) {
          if (acc[i]._id === obj._id) {
             acc[i].total += obj.total
             found = true;
          };
       }
       if (!found) {
          acc.push(obj);
       }
       return acc;
    }, []);
    return res;
 }

function getAllSum() {
    return new Promise(async (resolve, reject) => {
        try {
            let [policy, meeting, call] = await Promise.all([getTotalSum(Policy, 5), getTotalSum(Meeting, 2), getTotalSum(Call, 1) ]);
            let arrObj = combinedItems(policy.concat(meeting).concat(call));
            arrObj.sort((a,b) => (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0))
            return resolve(arrObj?.[0]??[])
        } catch (err) {
            return reject(err);
        }
    });
}
