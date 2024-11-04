import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

enum VideoActions {
  VideoEnd = "video-end",
  VideoLast = "video-last",
  VideoReset = "video-reset",
  Pause = "pause",
  Play = "play",
}

const VideoCarousel = () => {
  const videoRef = useRef<HTMLVideoElement[]>([]);
  const videoSpanRef = useRef<HTMLSpanElement[]>([]);
  const videoDivRef = useRef<HTMLSpanElement[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<
    Array<React.SyntheticEvent<HTMLVideoElement, Event>>
  >([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    const span = videoSpanRef.current;
    if (!span[videoId]) return;

    let currentProgress = 0;
    const anim = gsap.to(span[videoId], {
      onUpdate: () => {
        const progress = Math.ceil(anim.progress() * 100);

        if (progress != currentProgress) {
          currentProgress = progress;

          gsap.to(videoDivRef.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw" // mobile
                : window.innerWidth < 1200
                ? "10vw" // tablet
                : "4vw", // laptop
          });

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
        }
      },
      onComplete: () => {
        if (isPlaying) {
          gsap.to(videoDivRef.current[videoId], {
            width: "12px",
          });
          gsap.to(span[videoId], {
            backgroundColor: "#afafaf",
          });
        }
      },
    });

    if (videoId === 0) {
      anim.restart();
    }

    const animUpdate = () => {
      anim.progress(
        videoRef.current[videoId].currentTime /
          hightlightsSlides[videoId].videoDuration
      );
    };

    if (isPlaying) {
      gsap.ticker.add(animUpdate);
    } else {
      gsap.ticker.remove(animUpdate);
    }
  }, [videoId, startPlay]);

  useEffect(() => {
    if (loadedData.length <= hightlightsSlides.length - 1) return;
    if (!isPlaying) {
      videoRef.current[videoId].pause();
    } else if (startPlay) {
      videoRef.current[videoId].play();
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type: VideoActions, i?: number) => {
    switch (type) {
      case VideoActions.VideoEnd:
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: (i ?? 0) + 1 }));
        break;

      case VideoActions.VideoLast:
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case VideoActions.VideoReset:
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case VideoActions.Pause:
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case VideoActions.Play:
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => el && (videoRef.current[i] = el)}
                  onEnded={() =>
                    i < hightlightsSlides.length - 1
                      ? handleProcess(VideoActions.VideoEnd, i)
                      : handleProcess(VideoActions.VideoLast)
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(e)}
                  src={list.video}
                />
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => el && (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => el && (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess(VideoActions.VideoReset)
                : !isPlaying
                ? () => handleProcess(VideoActions.Play)
                : () => handleProcess(VideoActions.Pause)
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
