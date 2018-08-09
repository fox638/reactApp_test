import conferences from './conferences'
import firebase from 'firebase'

export function saveEventsToFB() {
    const eventsRef = firebase.database().ref('/events')
    console.log(eventsRef)
    conferences.forEach(conference  => eventsRef.push(conference))
}

window.runMigration = function() {
    console.log('Ronnn')
    try{
        firebase.database().ref('/events').once('value', data => {
            if (!data.val()) saveEventsToFB()
        })
    } catch(error){
        console.log(error)
    }
    
}