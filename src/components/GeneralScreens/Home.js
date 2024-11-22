// import React, { useContext, useState, useEffect, useRef } from "react";
// import { Helmet } from "react-helmet";
// import "../../Css/flexContainer.css";
// import instance from "../../Context/axiosConfig";
// import { v4 as uuidv4 } from "uuid";
// import { useLocation, useNavigate } from "react-router-dom";
// import configData from "../../config.json";
// import {
//   BiDollarCircle,
//   BiTime,
//   BiCheckCircle,
//   BiMedal,
//   BiX,
//   BiArrowToTop,
// } from "react-icons/bi";
// import SkeletonStory from "../Skeletons/SkeletonStory";
// import CardStory from "../StoryScreens/CardStory";
// import NoStories from "../StoryScreens/NoStories";
// import Pagination from "./Pagination";
// import "../../Css/Home.css";
// import ServicesComponent from "../utilities/services";
// import SquareCard from "../utilities/squareCard";
// import AboutSush from "./typingText";
// import ContactForm from "./contactForm";
// import { AuthContext } from "../../Context/AuthContext";
// import Caption from "../utilities/caption";
// import logo from "../../img/logo.png";
// import Testimonial from "./testimonial";
// import contentTypes from "../../data/services";
// import FAQComponent from "./faq";
// import faqData from "../../data/faqData";

// const Home = () => {
//   const search = useLocation().search;
//   const searchKey = new URLSearchParams(search).get("search");
//   const [stories, setStories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const { setCallScheduled, callScheduled } = useContext(AuthContext);
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   const top = useRef(null);

//   useEffect(() => {
//     const getStories = async () => {
//       setLoading(true);
//       try {
//         const { data } = await instance.get(
//           `/story/getAllStories?search=${searchKey || ""}&page=${page}`
//         );

//         if (searchKey) {
//           navigate({
//             pathname: "/",
//             search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
//           });
//         }

//         setStories(data.data);
//         localStorage.setItem("stories", JSON.stringify(data.data));
//         setPages(data.pages);

//         setLoading(false);
//       } catch (error) {
//         setLoading(true);
//       }
//     };
//     getStories();
//   }, [setLoading, search, page, navigate, searchKey]);

//   useEffect(() => {
//     setPage(1);
//   }, [searchKey]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     const currentRef = top.current;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setShowBackToTop(!entry.isIntersecting);
//       },
//       {
//         root: null,
//         rootMargin: "700px",
//         threshold: 1,
//       }
//     );

//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, [top]);

//   return (
//     <div style={{ background: configData.background }}>
//       <Helmet>
//         <title>{`Home | ${configData.Name}`}</title>
//         <meta
//           name="description"
//           content="Explore Sushmeela's portfolio showcasing advanced skills in web and application development. Discover projects, skills, and experiences."
//         />
//         <meta property="og:title" content={`${configData.Name} Portfolio`} />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://sushmeela-portfolio.com" />
//         <meta property="og:image" content={logo} />
//         <meta name="twitter:image" content={logo} />
//         <meta
//           property="og:description"
//           content="Explore Sushmeela's portfolio showcasing advanced skills in web and application development. Discover projects, skills, and experiences."
//         />
//         <link rel="canonical" href="https://sushmeela-portfolio.com" />
//         <meta name="robots" content="index, follow" />
//       </Helmet>

//       {callScheduled && (
//         <div className="contact-overlay">
//           <div
//             className="home-overlay"
//             onClick={() => {
//               setCallScheduled(false);
//               document.body.classList.remove("no-scroll");
//             }}
//           ></div>
//           <BiX
//             onClick={() => {
//               setCallScheduled(false);
//               document.body.classList.remove("no-scroll");
//             }}
//             style={{
//               position: "absolute",
//               right: 2,
//               top: 2,
//               fontSize: "35px",
//               zIndex: 9,
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           />
//           <ContactForm title={"Get A Quote"} />
//         </div>
//       )}

//       {showBackToTop && (
//         <a
//           href="#top"
//           style={{
//             position: "fixed",
//             bottom: 10,
//             right: 10,
//             borderRadius: "50%",
//             border: "none",
//             padding: "10px",
//             textDecoration: "none",
//             zIndex: 8,
//             backdropFilter: "blur(10px)",
//             background: "#ccc"
//           }}
//         >
//           <BiArrowToTop
//             style={{ fontSize: "40px", color: configData.AppColor }}
//           />
//         </a>
//       )}

//       <div style={{ height: "75px" }} id="top" ref={top}></div>
//       <AboutSush />
//       <div>
//         <ServicesComponent />
//       </div>
//       <Caption caption="Why Hire Me?" />
//       <div className="responsive-flex-square-container">
//         <SquareCard
//           icon={<BiDollarCircle fontSize="38px" />}
//           title="Affordable Pricing"
//           content="Competitively priced services without compromising quality. Exceptional value for your investment."
//         />

//         <SquareCard
//           icon={<BiTime fontSize="38px" />}
//           title="Fast Delivery"
//           content="Timely delivery guaranteed. Streamlined processes ensure quick turnaround times."
//         />

//         <SquareCard
//           icon={<BiCheckCircle fontSize="38px" />}
//           title="Uncompromising Quality"
//           content="Top priority on quality. Strict standards and rigorous checks for excellence."
//         />

//         <SquareCard
//           icon={<BiMedal fontSize="38px" />}
//           title="Advanced Skills"
//           content="With my advanced skills, I bring exceptional expertise and proficiency to every project."
//         />
//       </div>
//       <div className="flex-style" id="Testimonial">
//         <Testimonial />
//       </div>
//       <Caption caption="My Services" />
//       <div className="responsive-flex-square-container">
//         {contentTypes.map((contentType, index) =>(
//           <SquareCard
//           icon={contentType.icon}
//           title={contentType.navName}
//           content={contentType.content}
//         />))}
//       </div>

//       <Caption caption="Frequently Asked Questions" />
//       <FAQComponent faqData={faqData}/>

//       <Caption caption="Latest Posts" />
//       {loading ? (
//         <div className="skeleton_emp">
//           {[...Array(3)].map(() => {
//             return <SkeletonStory key={uuidv4()} />;
//           })}
//         </div>
//       ) : (
//         <div>
//           <div className="story-card-wrapper">
//             {stories.length !== 0 ? (
//               stories.map((story) => {
//                 return (
//                   <>
//                     <CardStory key={uuidv4()} story={story} />
//                   </>
//                 );
//               })
//             ) : (
//               <NoStories />
//             )}
//           </div>

//           <Pagination page={page} pages={pages} changePage={setPage} />
//         </div>
//       )}
//       <br />
//     </div>
//   );
// };

// export default Home;
