import "./App.css";
import Demo from './assets/components/front1';
import Hero from "./assets/components/front2";
import 'flowbite';
const App = () => {
  return (
    <main>
      <div className="main">
        <div className="gradient"/>
      </div>
      <div className="app">
        <Hero />
        <Demo />
      </div>
    </main>
  );
};

export default App;
