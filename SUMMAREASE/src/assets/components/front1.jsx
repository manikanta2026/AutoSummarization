import { useState } from 'react';
import axios from 'axios';
import copy from "./copy.svg";
import tick from "./tick.svg";
import "../../App.css";

const Demo = () => {
  const [summary, setSummary] = useState('');
  const [qa, setQa] = useState([]); 
  const [file, setFile] = useState(null);
  const [copied, setCopied] = useState('');
  const [summaryLevel, setSummaryLevel] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSummarySubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('summary_type', summaryLevel);

    try {
      const response = await axios.post('http://localhost:5000/summary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error uploading the file:', error);
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const handleQaSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/qa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setQa(response.data.qa || []);  
    } catch (error) {
      console.error('Error uploading the file:', error);
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const handleCopy = (text) => {
    if (text) {
      setCopied(text);
      navigator.clipboard.writeText(text);
      setTimeout(() => setCopied(''), 3000); 
    }
  };

  return (
    <section className="mt-10 w-full max-w-xl mx-auto">
      <div className={`flex flex-col w-full gap-2 ${isDisabled ? 'pointer-events-none' : ''}`}>
        <form className="relative flex flex-col items-center gap-2" onSubmit={handleSummarySubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="fileinput"
            onFocus={(e) => (e.target.style.borderColor = '#4682b4')}
            onBlur={(e) => (e.target.style.borderColor = '#1E90FF')}
            disabled={isDisabled}
          />
          <div className="flex gap-4 mt-4">
            <select
              value={summaryLevel}
              onChange={(e) => setSummaryLevel(e.target.value)}
              className="drop-down-menu"
              disabled={isDisabled}
            >
              <option value="small">Abstract</option>
              <option value="medium">Summary</option>
              <option value="large">Article</option>
            </select>
            <button
              type="submit"
              className="submit_btn"
              disabled={isDisabled}
            >
              Summarize
            </button>
            <button
              onClick={handleQaSubmit}
              className="submit_btn"
              disabled={isDisabled}
            >
              Generate Q&A
            </button>
          </div>
        </form>
      </div>

      {isLoading && <div className="loader"></div>}

      <div className="my-10 max-w-full flex flex-col justify-center items-center">
        {summary && (
          <div className="flex flex-col gap-3 mb-6">
            <h2 className="font-satoshi font-bold text-gray-600">
              <span className="blue_gradient">PDF Summary</span>
            </h2>
            <div className="summary_box font-inter font-medium text-sm">
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
            <div className="copy_btn" onClick={() => handleCopy(summary)}>
              <img
                src={copied === summary ? tick : copy}
                alt="copy_icon"
                className="svg-copy"
              />
            </div>
          </div>
        )}

        {qa.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-satoshi font-bold text-gray-600">
              <span className="blue_gradient">PDF Q&A</span>
            </h2>
            <div className="summary_box font-inter font-medium text-sm">
              <div dangerouslySetInnerHTML={{ __html: qa }} />
            </div>
            <div className="copy_btn" onClick={() => handleCopy(qa)}>
              <img
                src={copied === qa ? tick : copy}
                alt="copy_icon"
                className="svg-copy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
