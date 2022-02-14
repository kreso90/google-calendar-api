import React, {useEffect, useState} from 'react'
import { gapi } from 'gapi-script'
import { useGoogleAuth } from '../GoogleAuth';

const HomePage = () => {
  const { isSignedIn } = useGoogleAuth();
  const { signOut } = useGoogleAuth();
  const [name, setName] = useState([])
  const [event, setEvent] = useState({});
  const [days, setDays] = useState(7)
  const [week, setWeek] = useState([])
  var events = {
    'summary': event.summary,
    'start': {
      'dateTime': new Date(event.start),
      'timeZone': 'UTC'
    },
    'end': {
      'dateTime': new Date(event.end),
      'timeZone': 'UTC'
    },
  }
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEvent(values => ({...values, [name]: value}))
  }
  
  const calendarId = 'primary';
  const apiKey = 'AIzaSyCBE-4lOs-zpNxJ4jUtbAuxixQRXVKX3K4';
  const userTimeZone = "UTC";

  useEffect(() =>  {
    printCalendar();
  }, [])

function printCalendar() {
  gapi.load('client:auth2', () => {
  gapi.client.init({
    'apiKey': apiKey,
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  }).then(function () {
    return gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeZone': userTimeZone,
        'singleEvents': true,
        'maxResults': days,
        'orderBy': 'startTime'
        
    });
  }).then(function (response) {
      setName(response.result.items)
      console.log(response.result)
  }, function (reason) {
      console.log('Error: ' + reason.result.error.message);
  });
 });
};


  function addEvent(e)  {
    e.preventDefault();
    gapi.client.init({
      'apiKey': apiKey,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
      return gapi.client.calendar.events.insert({
          'calendarId': calendarId,
          'resource': events,
      });
     
    })
    printCalendar();
  }

  function deleteEvent(eventId){
    gapi.client.init({
      'apiKey': apiKey,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
      return gapi.client.calendar.events.delete({
          'calendarId': calendarId,
          'eventId': eventId,
      });
     
    })
    printCalendar();
  }




  return (
    <div>HomePage
       {name.map((event, index) => (
      
        <div onClick={() => deleteEvent(event.id)} key={index}>{event.summary}, {event.id}, {event.start.dateTime}</div>
        
    ))}
      <button onClick={signOut}>Logout</button>

      <form onSubmit={addEvent}>

      <label>Enter your name:
      <input 
        type="text" 
        name="summary" 
        value={event.summary || ""} 
        onChange={handleChange}
      />
      </label>
      <label>Enter start:
        <input 
          type="datetime-local" 
          name="start" step="2"
          value={event.start || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Enter end:
        <input 
          type="datetime-local" 
          name="end" step="2"
          value={event.end || ""} 
          onChange={handleChange}
        />
        </label>
        <input type="submit" />
    </form>
    </div>
  )
}

export default HomePage