import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

import Tracks from '../components/Tracks';
import AudioFeatures from '../components/Audiofeatures';
import SelectOptions from '../components/SelectOptions';
import ArtistGenres from '../components/ArtistGenres';
import DisplayError from '../components/DisplayError';

const TopTracks = () => {
  const { token } = useContext(UserContext);
  const history = useHistory();
  const [timeRange, setTimeRange] = useState('medium_term');
  const [limit, setLimit] = useState(20);

  const [tracks, setTracks] = useState(undefined);
  const [trackIds, setTrackIds] = useState(undefined);
  const [audioFeatures, setAudioFeatures] = useState(undefined);
  const [artistData, setArtistData] = useState(undefined);
  const [artistHREFs, setArtistHREFs] = useState(undefined);

  useEffect(() => {
    const getTracks = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&offset=0&limit=${limit}`,
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });

        const tracklist = response.data.items;
        setArtistHREFs(tracklist.map((track) => track.artists[0].href));
        setTrackIds(tracklist.map((track) => track.id));
        setTracks(tracklist);
      } catch (err) {
        console.log(err.message);
      }
    };

    if (!token) {
      history.push('/');
    } else {
      getTracks();
    }
  }, [history, token, timeRange, limit]);

  const resetData = () => {
    setTracks(undefined);
    setTrackIds(undefined);
    setArtistData(undefined);
    setArtistHREFs(undefined);
    setAudioFeatures(undefined);
  };

  return (
    <div>
      <SelectOptions
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        limit={limit}
        setLimit={setLimit}
        resetData={resetData}
      />

      {tracks && tracks.length > 0 ? (
        <>
          <AudioFeatures
            trackIds={trackIds}
            setAudioFeatures={setAudioFeatures}
          />
          <ArtistGenres
            artistHREFs={artistHREFs}
            setArtistData={setArtistData}
          />

          <Tracks
            tracks={tracks}
            audioFeatures={audioFeatures}
            artistData={artistData}
          />
        </>
      ) : (
        <DisplayError />
      )}
    </div>
  );
};

export default TopTracks;
