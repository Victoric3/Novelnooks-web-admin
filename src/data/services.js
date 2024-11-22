import {
  BiSearch,
  BiTargetLock,
  BiLogoYoutube,
  BiLogoFacebookCircle,
  BiPen,
  BiBookContent,
  BiMoney
} from "react-icons/bi";

const contentTypes = [
  {
    content: "I craft SEO-optimized content that boosts your online visibility and drives traffic to your site.",
    navName: "SEO Writing",
    icon: <BiSearch fontSize="38px" />,
  },
  {
    content: "I create targeted ads and marketing content that connects with your audience and drives conversions.",
    navName: "Ads/Marketing",
    icon: <BiTargetLock fontSize="38px" />,
  },
  {
    content: "I write engaging YouTube scripts that captivate viewers and grow your subscriber base.",
    navName: "YouTube Scripts",
    icon: <BiLogoYoutube fontSize="38px" />,
  },
  {
    content: "I deliver well-researched and insightful blog posts that establish your authority and engage readers.",
    navName: "Blog Writing",
    icon: <BiPen fontSize="38px" />,
  },
  {
    content: "I create compelling content that strengthens your brand's voice and resonates with your audience.",
    navName: "Content Writing",
    icon: <BiLogoFacebookCircle fontSize="38px" />,
  },
  {
    content: "I offer clear and actionable financial advice content to help your audience make informed decisions.",
    navName: "Financial Advice",
    icon: <BiMoney fontSize="38px" />,
  },
  {
    content: "I develop educational content that informs and empowers your audience on a variety of topics.",
    navName: "Educational Content",
    icon: <BiBookContent fontSize="38px" />,
  },
];



export default contentTypes