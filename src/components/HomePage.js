import React, {useEffect, useState} from 'react'
import { gapi } from 'gapi-script'
import { useGoogleAuth } from '../GoogleAuth';
import moment from 'moment';

const HomePage = () => {
 
  const { signOut } = useGoogleAuth();
  const [item, setItem] = useState([]);
  const [deleteEv, setDeleteEv] = useState([]);
  const [event, setEvent] = useState({});
  const [days, setDays] = useState(7)

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEvent(values => ({...values, [name]: value}))
  }

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
  
  const calendarId = 'primary';

  let date = new Date();
  const maxDate = date.setDate(date.getDate()) 
  const currentDate = moment(maxDate).add(days, 'days').format()

  function printCalendar(){
    gapi.load('client:auth2', () => {
      gapi.client.init({
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      })
      .then(function () {
        return gapi.client.calendar.events.list({
            calendarId: calendarId,
            singleEvents: true,
            orderBy: 'startTime',
            timeMin: (new Date()).toISOString(),
            timeMax: currentDate,
        });
      }).then(function (response) {
          setItem(response.result.items)
          console.log(response.result.items)
      });
    });
  };

  function addEvent(e)  {
    e.preventDefault();
    gapi.client.init({
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
      return gapi.client.calendar.events.insert({
          'calendarId': calendarId,
          'resource': events,
      });
    })
    setEvent('')
    printCalendar();
  }

  function deleteEvent(eventId, index){
    setDeleteEv(deleteEv.filter((v, event) => event !== index));
    gapi.client.init({
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
      return gapi.client.calendar.events.delete({
          'calendarId': calendarId,
          'eventId': eventId,
      });
    })
    printCalendar();
  }
  
  useEffect(() =>  {
    printCalendar()
  }, [event, days, deleteEv])

  return (
    <div className='container'>
      <select onChange={(e) => {
          const selectDay = e.target.value;
          setDays(selectDay)
          printCalendar();
        }} value={days}>
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
      </select>

      <table>
        <tbody>
          <tr>
            <th>Event name</th>
            <th>Start date and time</th>
            <th>End date and time</th>
          </tr>
          {item.map((event, index) => (
          <tr key={index}>
            <td>{event.summary} </td>
            <td>{moment(event.start.dateTime).format('l') }, {moment(event.start.dateTime).format('LT') }</td>
            <td>{moment(event.end.dateTime).format('l') }, {moment(event.end.dateTime).format('LT') }</td>
            <td onClick={() => deleteEvent(event.id)} className="delete">Delete</td>
          </tr>
          ))}
        </tbody>
    </table>
      

      <form onSubmit={addEvent}>

        <label>Enter event name:</label>
        <input 
          type="text" 
          name="summary" 
          value={event.summary || ""} 
          onChange={handleChange}
        />
        
        <label>Enter start date and time:  </label>
          <input 
            type="datetime-local" 
            name="start" step="2"
            value={event.start || ""} 
            onChange={handleChange}
          />
        
          <label>Enter end date and time: </label>
          <input 
            type="datetime-local" 
            name="end" step="2"
            value={event.end || ""} 
            onChange={handleChange}
          />
        
          <input type="submit" />
      </form>
   
      <div className='logout'>
        <button onClick={signOut}>Logout</button>
      </div>
    </div>
  )
}

export default HomePage