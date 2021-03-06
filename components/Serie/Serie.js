import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import instance from "../axios";

import MovieLoading from "../Movie/MovieLoading";
import MovieUnavailable from "../Movie//MovieUnavailable";
import SerieInfo from "./SerieInfo";

function Serie() {
  const [serieResults, setSerieResults] = useState({});
  const [isApiSubscribed, setIsApiSubscribed] = useState(true);
  const [serieLoaded, setSerieLoaded] = useState(false);
  const [serieUnavailable, setSerieUnavailable] = useState(false);

  const router = useRouter();
  const { serieId } = router.query;

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    const serieDetailsRequests = [
      `/tv/${serieId}?api_key=${process.env.API_KEY}&language=en-US`,
      `/tv/${serieId}/credits?api_key=${process.env.API_KEY}&language=en-US`,
      `/tv/${serieId}/images?api_key=${process.env.API_KEY}`,
      `/tv/${serieId}/keywords?api_key=${process.env.API_KEY}`,
      `/tv/${serieId}/reviews?api_key=${process.env.API_KEY}&language=en-US&page=1`,
      `/tv/${serieId}/similar?api_key=${process.env.API_KEY}&language=en-US&page=1`,
      `/tv/${serieId}/videos?api_key=${process.env.API_KEY}&language=en-US`,
      `/tv/${serieId}/watch/providers?api_key=${process.env.API_KEY}`,
    ];

    const http = rateLimit(instance, {
      maxRequests: serieDetailsRequests.length,
      perMilliseconds: 600,
      maxRPS: 4,
    });

    function fetchSerie() {
      Promise.all(
        serieDetailsRequests.map(
          async (request) =>
            await http.get(request, {
              cancelToken: source.token,
            })
        )
      )
        .then((res) => {
          if (isApiSubscribed) {
            res.map((serieResult, index) => {
              switch (index) {
                case 0:
                  serieResults.details = serieResult.data;
                  break;
                case 1:
                  serieResults.credits = serieResult.data;
                  break;
                case 2:
                  serieResults.images = serieResult.data;
                  break;
                case 3:
                  serieResults.keywords = serieResult.data;
                  break;
                case 4:
                  serieResults.reviews = serieResult.data;
                  break;
                case 5:
                  serieResults.similar = serieResult.data;
                  break;
                case 6:
                  serieResults.videos = serieResult.data;
                  break;
                case 7:
                  serieResults.watchProviders = serieResult.data.results;
                  break;
                default:
                  break;
              }
              setSerieResults({ ...serieResults });
            });
            setSerieLoaded(true);
          }
        })
        .catch(() => setSerieUnavailable(true));
    }

    if (serieId) fetchSerie();

    return () => {
      setIsApiSubscribed(false);
      source.cancel("Request canceled.");
    };
  }, [serieId]);

  return (
    <>
      <Head>
        <title>
          YMDB-
          {serieResults?.details?.name || serieResults?.details?.original_name}
        </title>
      </Head>
      <main>
        {serieUnavailable ? (
          <MovieUnavailable />
        ) : serieLoaded ? (
          <SerieInfo serieResults={serieResults} serieId={serieId} />
        ) : (
          <MovieLoading />
        )}
      </main>
    </>
  );
}

export default Serie;
