// this are jest function
const request=require('supertest');
const app=require('../../app');
const {mongoconnect}=require('../../services/mongo')
describe('Launches API',()=>{
  beforeAll(async ()=>{
    await mongoconnect();
  })
  describe('Test GET /launches',()=>{
    test('It should respond with 200 success', async ()=>{
      const response=await request(app)
      .get('/launches').expect(200).expect('Content-Type',/json/);
      // expect(response.statusCode).toBe(200);
    })
  })
  describe('Test POST /launch',()=>{
    const completelaunchDate={
      mission:'USS Enterprise',
      rocket:"NCC 1701-D",
      target:'Kepler-186 f',
      launchDate:'January 4, 2028',
    }
    const launchdatawithoutdate={
      mission:'USS Enterprise',
      rocket:"NCC 1701-D",
      target:'Kepler-186 f'
  
    }
    const launchDatewitInvalidDate={
      mission:'USS Enterprise',
      rocket:"NCC 1701-D",
      target:'Kepler-186 f',
      launchDate:'zoot',
    }
    test('It should respond with 201 success',async()=>{
        const response=await request(app).post('/launches').send(completelaunchDate).expect(201).expect('Content-Type',/json/);
        const requestdate=new Date(completelaunchDate.launchDate).valueOf();
        const responseDate=new Date(response.body.launchDate).valueOf();
        expect(requestdate).toBe(responseDate);
        expect(response.body).toMatchObject(launchdatawithoutdate)
        //==
  
    });
    test('It should catch missing require properties',async()=>{
        const response=await request(app).post('/launches').send(launchdatawithoutdate).expect('Content-Type',/json/).expect(400);
        expect(response.body).toStrictEqual({
          error:"require missing some property Invalid Input"
      })
    });
    test('It should catch invalid dates',async()=>{
      const response=await request(app).post('/launches').send(launchDatewitInvalidDate).expect('Content-Type',/json/).expect(400);
      expect(response.body).toStrictEqual({
        error:'Invalid launch date',
    })
    });
  })
})
