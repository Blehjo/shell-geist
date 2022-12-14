import axios from 'axios';

const gameData = async (value) => {
  const options = await axios({
    url: process.env.REACT_APP_URL,
    method: 'POST',
    headers: {
        'x-api-key': process.env.REACT_APP_X_API_KEY,
    },
    data: `fields name, first_release_date, platforms.abbreviation, summary, storyline, rating, cover.image_id; search "${value}";`
  })
  

  return options
};

export default gameData;