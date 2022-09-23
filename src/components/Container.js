import React, { useState, useEffect } from "react";
import NavBar from "./main/NavBar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import token from "../utils/API";
import TournamentCarousel from "./Carousels/TournamentCarousel";
import SidebarIndex from "./main/SidebarIndex";

const Container = (props) => {
    const [value, setValue] = useState(props.value);
    const [show, setShow] = useState(false);
    const [results, setResults] = useState([]);
    const [accessToken, setToken] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
    function handleInputChange(evt) {
        evt.preventDefault();
        setValue(evt.target.value);
    };

    function handleClickEvent(evt) {
        evt.preventDefault();
        setShow(!show);
    };

    // Method to get search results and set state
    const getToken = async (accessToken) => {
        const response = await token(accessToken);
        setToken(response.data);
    };

    // We want to run this method when the component first loads so that we have images of kittens to display
    // The second argument is the dependency array. This means that this method will only run when the component first loads
    useEffect(() => {
        getToken(accessToken);
    }, []);

    return (
        <>
            <div className="fixed-top">
                <NavBar 
                key={'navbar'}
                onSearchChange={handleInputChange}
                onClickEvent={handleClickEvent}
                value={value}
                />
            </div>
            <Row className='mw-100'key={1}>
                <Col className=""xs="1" lg="1" key={1}>
                    <SidebarIndex show={show}/>
                </Col>
                <Col key={2}>
                    <TournamentCarousel/>
                    {/* <Genre 
                        accessToken={accessToken} 
                        value={value}
                    />
                    <Body results={results}/> */}
                </Col>
            </Row>
        </>
    )
}

export default Container;