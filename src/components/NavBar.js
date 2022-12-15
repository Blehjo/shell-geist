import { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Form, Col, Row, Nav, Navbar } from 'react-bootstrap';

import ListIcon from './list-icon/list-icon';

import ProfileIcon from './profile-icon/profile-icon';
import ProfileDropdown from './profile-dropdown/profile-dropdown';

import { UserContext } from '../contexts/user.context';
import { ResultContext } from '../contexts/result.context';
import { ProfileContext } from '../contexts/profile.context';
import { SearchContext } from '../contexts/search.context';
import { UserProfilesContext } from '../contexts/userprofiles.context';

import axios from 'axios';

function NavBar() {
  const { currentUser } = useContext(UserContext);
  const { isProfileOpen } = useContext(ProfileContext);
  const { searchField, setSearchField } = useContext(SearchContext);
  const { setResults } = useContext(ResultContext);
  const { userProfiles, setUserProfiles } = useContext(UserProfilesContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (evt) => {
    evt.preventDefault();
    setSearchField(evt.target.value);
  };

  const handleClickEvent = async (evt) => {
    evt.preventDefault();

    async function getGames () {
      await axios({
        url: process.env.REACT_APP_URL,
        method: 'POST',
        headers: {
            'x-api-key': process.env.REACT_APP_X_API_KEY,
        },
        mode: 'no-cors',
        data: `fields name, platforms.abbreviation, rating, genres, release_dates, first_release_date, cover.image_id, age_ratings, summary; search "${searchField}"; limit 50;`
      })
      .then(response => {
        setResults(response.data);
      })
      .then(() => {
        navigate('/search');
      })
      .catch(err => {
          setErrorMessage(err);
          console.error(errorMessage);
      });
    }

    getGames();
  };

  useEffect(() => {
    function searchUsers () {
      axios.get('/users', {
        mode: 'no-cors'
      })
      .then((response) => {
        setUserProfiles(response.data)
      });
      console.log(userProfiles);
    }
    searchUsers();
  }, [])

  return (
    <Fragment>
      {['sm'].map((expand) => (
          <Row key="sm"style={{ margin: '2rem' }} >
            <Navbar fixed='top' style={{ zIndex: 1000 }}  key={expand}  bg='dark' variant='dark' expand={expand}>
              <ListIcon key='listicon'/>
              <Col key="listColumn" className=''>
                <Nav key="listColumn" className=''>
                  <Navbar.Brand href="/" className='text-white'>Shell Geist</Navbar.Brand>
                </Nav>
              </Col>
              <Navbar.Toggle key="navbarToggle" aria-controls={`navBarItems}`} />
              <Navbar.Collapse key="navbarCollapse" id="navBarItems">
                <Col key="searchColumn" className=''>
                  <Nav key="navForm">
                    <Form onSubmit={handleClickEvent} className="d-flex">
                      <Form.Control
                        onChange={handleInputChange}
                        type="search"
                        placeholder="Search"
                        className="me-2 "
                        aria-label="Search"
                        key="form-controller"
                        />
                      <Button key="button-search" type="submit" variant="info">Search</Button>
                    </Form>
                  </Nav>
                </Col>
                <Col key="navigationIcons">
                    <Nav key="navIcons" variant='dark'className="justify-content-end flex-grow-1 pe-3">
                      {
                        currentUser ? (
                            <Nav.Link key='profile' href="#profile" ><ProfileIcon/></Nav.Link>
                        ) : (
                            <Nav.Link className='nav-link' href='/authentication'>
                                SIGN IN
                            </Nav.Link>
                        )
                      }
                      {isProfileOpen && <ProfileDropdown />}
                    </Nav>
                </Col>
              </Navbar.Collapse>
            </Navbar>
          </Row>
      ))}
    </Fragment>
  );
}

export default NavBar;