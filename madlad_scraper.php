<?php
    require_once 'simple_html_dom.php';

    function movieShowtimes($imdbDateUrl){
        //get html content from the site.
        $dom = file_get_html($imdbDateUrl, false);
        
        //collect all movies into an array
        $answer = array();
        $movie_anchor;
        if(!empty($dom)) {
            $divClass = $title = "";$i = 0;
            foreach($dom->find("#main .article") as $divClass) {
                //theater
                foreach($divClass->find(".list.detail > .list_item") as $theaterDiv ) {
                    $theater = $theaterDiv->find('h3 a[itemprop=url]', 0);
                    $answer[$i]['theater'] = $theater->plaintext;
                    $theater_movies = array();
                    // movie
                    foreach($theaterDiv->find(".list_item") as $movie){
                        $movie_listing = array();
                        $movie_anchor = $movie->find("h4 > span > a[itemprop=url]", 0);
                        $movie_listing['title'] = $movie_anchor->plaintext;
                        $showtime_text = "";
                        // movie showing
                        foreach($movie->find(".info h5, .info .showtimes") as $showtimes){
                            $showtime_text .= $showtimes->plaintext;
                        }
                        $showtime_text = str_replace("Get Tickets", "", $showtime_text);
                        $movie_listing['showings'] = $showtime_text;
                        $theater_movies[] = $movie_listing;
                    }
                    $answer[$i]['movies'] = $theater_movies;
                    $i++;
                }
            }
        }
        return $answer;
    }

    function dateToUrl($date){
        $year = $date->format('Y');
        $month = $date->format('m');
        $day = $date->format('d');
        

        $urlDay = sprintf("%02d-%02d-%02d", $year, $month, $day);

        $url = "https://www.imdb.com/showtimes/$urlDay?ref_=sh_dt";
        return $url;
    }

    $targetDate = new DateTime();
    $interval = new DateInterval('P1D');

    for($j = 0; $j < 7; $j++){
        echo $targetDate->format('m-d-Y');
        echo "<br>";
        $movieURL = dateToUrl($targetDate);
        $shows = movieShowtimes($movieURL);
        print_r($shows);
        echo "<br>";
        $targetDate->add($interval);
    }
    exit;

?>