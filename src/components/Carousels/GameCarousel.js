import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import unixConverter from '../../utils/Date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload, faCommentAlt, faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'

const GameCarousel = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios({
            url: "https://5f5gh8905l.execute-api.us-west-2.amazonaws.com/production/v4/games",
            method: 'POST',
            headers: {
                'x-api-key': process.env.REACT_APP_X_API_KEY,
            },
            data: `fields name, first_release_date, platforms.abbreviation, summary, storyline, rating, cover.image_id; sort rating desc; where rating >= 90; limit 72;`
          })
            .then(response => {
                setGames(response.data);
            })
            .catch(err => {
                setErrorMessage(err);
                console.error(errorMessage);
            });
    }, [errorMessage]);


    return (
        <>
            <Row>
                <h1 className="text-white">Games</h1>
                <Col >
                    <Carousel
                        additionalTransfrom={0}
                        arrows
                        autoPlaySpeed={3000}
                        centerMode={false}
                        className=""
                        containerClass=""
                        dotListClass=""
                        draggable
                        focusOnSelect={false}
                        infinite
                        itemClass=""
                        keyBoardControl
                        minimumTouchDrag={80}
                        pauseOnHover
                        renderArrowsWhenDisabled={false}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        responsive={{
                            desktop: {
                                breakpoint: {
                                    max: 3000,
                                    min: 1024
                                },
                                items: 4,
                                partialVisibilityGutter: 0
                            },
                            mobile: {
                                breakpoint: {
                                    max: 464,
                                    min: 0
                                },
                                items: 1,
                                partialVisibilityGutter: 30
                            },
                            tablet: {
                                breakpoint: {
                                    max: 1024,
                                    min: 464
                                },
                                items: 2,
                                partialVisibilityGutter: 30
                            }
                        }}
                        rewind={false}
                        rewindWithAnimation={false}
                        rtl={false}
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                        >
                        {games?.map((game) => (
                            <Card style={{ }} className="mx-2 bg-dark card-container h-100" key={game.id}>
                            <div className='card-container'>
                            <Card.Link className='card-info' href={`/${game.name}`}>
                            {<Card.Img className='img-fluid' variant="top" src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover?.image_id}.jpg`} />}
                            </Card.Link>
                            <Card.ImgOverlay>
                                <Card.Text>
                                <FontAwesomeIcon className="icon" icon={faEye} />
                                </Card.Text>
                                <Card.Text className='icon2'>
                                    <FontAwesomeIcon className="icon-item" icon={faHeart} />
                                    <FontAwesomeIcon className="icon-item" icon={faCommentAlt} />
                                    <FontAwesomeIcon className="icon-item" icon={faRetweet} />
                                </Card.Text>
                                <Card.Text className="icon3">
                                    <FontAwesomeIcon className="" icon={faDownload} />
                                </Card.Text>
                            </Card.ImgOverlay>
                            </div>
                            <Card.Body className=''>
                                <Card.Text>
                                {unixConverter(game.first_release_date)}
                                </Card.Text>
                                <Card.Text>
                                {game.rating !== undefined ? `Rating: ${Math.round(game.rating)}` : ''}
                                </Card.Text>
                                <Card.Text>
                                {`Platforms: ${game.platforms?.map((element) => (`\n${element.abbreviation}`))}`}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        ))}
                    </Carousel>
                </Col>
            </Row>
        </>
    )
}

export default GameCarousel;