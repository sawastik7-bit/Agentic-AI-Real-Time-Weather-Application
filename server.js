import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();




const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey:process.env.OPEN_ROUTER_API_KEY,
});

// first function is to get the current location 

async function getLocation(){
  const response=await fetch("https://ipapi.co/json/");
  const locationData=response.json();

  return locationData;   // return some data like latitude and longitude which we will feed into our getweather function

}

// second function is to get the current weather of the location
async function getCurrentWeather(latitude,longitude){
  const url=`https://open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response =await fetch(url);
  const weatherData=response.json();
  return weatherData;
}


// now we will describe a function to open ai 
// for this we have a specific schema 


// step 1 , create an array called tools 
// step2, one object per function ,each object have two keys , type, function and function key has three subkeys :name,description and parameters

const tools=[
  {
    type:"function",
    function:{
      name:"getCurrentWeather",
      description:"Get the current weather in a given location",
      parameters:{
        latitude:{
          type:"string"
        },
        longitude:{
          type:"string"
        }
      },
      require:["longitude","latitude"],
    }
  },
  {
    type:"function",
    function:{
      name:"getLocation",
      description:"Get the user's location based on their IP address",
      parameters:{
        type:"object",
        properties:{},
      }
    }
  }
]


// now we will create a message array which will keep the track of all of our messages btw our app and open ai 
// the first object in the array should always have the role property set to "system" which tell OPENAI that this is how we want it to behave

const messages=[
  {
    role:"system",
    content:"You are a helpful assistant. Only use the functions you have been provided with.",
  },

]



// now creating the agent function 
// its asynchronous and takes one argument: the userinput 

 // we start by pushing the user input to the message array. this time we set a role to user , so that open ai knows it is the input from the user


 async function agent(userInput){
  messages.push({
    role:"user",
    content:userInput,
  });

  
 const response = await client.chat.completions.create({
  model:"google/gemma-4-31b-it:free",   
  messages:messages,
  tools:tools,
});
console.log(response);
 
 }

 agent("where i am located right now?");  // this is the user input we are providing
 // it will give the output in the console


//  const models=await client.models.list();
//  console.log(models);


// google/gemma-4-26b-a4b-it:free

 