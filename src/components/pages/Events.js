import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Button } from "react-bootstrap";

const Events = () => {

    const [events, setEvents] = useState([]);

    async function handleClickEvent(event) {
        await axios({
            method: 'post',
            url: `https://shellgeistapi.herokuapp.com/api/eventMembers/`, 
            data: {
                event_id: event.target.id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
    }
    
    async function unfollowEvent(event) {
        await axios({
            method: 'delete',
            url: `https://shellgeistapi.herokuapp.com/api/eventMembers/${event.target.id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
    }

    useEffect(() => {
        async function getUser() {
            await axios({
                method: 'get',
                url: 'https://shellgeistapi.herokuapp.com/api/users',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
        }

        async function getEvents() {
            await axios({
                method: 'get',
                url: 'https://shellgeistapi.herokuapp.com/events/',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then((response) => setEvents(response.data));
        }

        getUser();
        getEvents();
    }, []);

    return (
        <Row xs={1} key="events">
            {Array.from(events)?.map(({ id, event_name, event_description, group, group_id, media_location_url, eventmembers }) => (
                <Row style={{ marginBottom: '2rem', textDecoration: 'none', color: 'white' }}>
                    <Col xl={4}>
                        <Card.Img height='200' style={{ objectFit:'cover', borderRadius: '.5rem' }} src={`${"https://www.museothyssen.org/sites/default/files/styles/full_resolution/public/imagen/2019-10/PICASSO%2C%20Pablo%20Ruiz_Corrida%20de%20toros_706%20%281976.83%29_FOTOH%20%23F21.jpg"}`} />
                    </Col>
                    <Col xl={8} key={id}>
                        <Card.Link style={{ textDecoration: 'none', color: 'white' }} href={`/groups/${id}`}>
                            <Card.Header>{event_name}</Card.Header>
                        </Card.Link>
                        <Card.Body style={{ marginBottom: '1rem' }}>
                            <Card.Text>
                                {event_description}
                            </Card.Text>
                            {/* <Badge pill='info'>{platform}</Badge>{' '} */}
                        </Card.Body>
                        <Card.Footer>
                            <Row xs={1}>
                                <Col>
                                    Group: {group.group_name} 
                                </Col>
                                <Col>
                                    Attending: {eventmembers.length > 0 && eventmembers.length}
                                </Col>
                                <Col style={{ marginTop: '1rem' }}>
                                    {eventmembers.length > 0 && (eventmembers.some(({ profile_id }) => profile_id === 'auth.id')) ? <Button variant="light" id={id} onClick={unfollowEvent}>Leave Event</Button> : <Button variant="light" id={id} onClick={handleClickEvent}>Join Event</Button>}
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Col>
                </Row>
            ))}
        </Row>
    )
}

export default Events;