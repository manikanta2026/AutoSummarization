import logo from './logo.svg';
import github from './github.svg';
const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="w-full flex md:justify-between mb-10 pt-3">
        <img src={logo} alt=''></img>

        <a href="https://github.com/your-profile" target="_blank">
  <img src={github} alt="GitHub Profile" />
</a>
      </nav>
      <h1 className="head_text">
        Summarize and Generate Q&A with <br className="max-md:hidden" />
        <span className="orange_gradient ">SummarEase</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with SummarEase, an open-source tool that transforms lengthy PDFs into clear and concise summaries and generates Q&A
      </h2>
    </header>
  );
};

export default Hero;
