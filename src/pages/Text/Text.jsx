import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Text.css";

const Text = () => {
	const { Questions } = useContext(ThemeContext);
	const [sentence, setSentence] = useState(0);
	const [questions, setQuestions] = useState([]);
	const [question, setQuestion] = useState({});
	const [lock, setLock] = useState(false);
	const [correct,setCorrect]=useState(0);

	const Option1 = useRef(null);
	const Option2 = useRef(null);
	const Option3 = useRef(null);
	const Option4 = useRef(null);
	const Options = [Option1, Option2, Option3, Option4];

	useEffect(() => {
		if (Questions && Questions.length > 0) {
			setQuestions(Questions);
			setQuestion(Questions[sentence]);
		}
	}, [sentence, Questions]);

	const handleCheckAns = (e, ans) => {
		if (lock === false) {
			if (ans === question.answer) {
				e.target.classList.add("correct");
				setLock(true);
				setCorrect(correct+1);
			} else {
				e.target.classList.add("wrong");
				Options[question.answer - 1]?.current.classList.add("correct");
				setLock(true);
			}
		}
	};

	const handleNext = () => {
		if (lock)
			if (sentence < questions.length) {
				setSentence(sentence + 1);
				setLock(false);
				Options.map((item) => {
					item.current.classList.remove("wrong");
					item.current.classList.remove("correct");
				});
			}
	};
	const handleAgain = () => {
		setSentence(0);
		setLock(false);
		setCorrect(0);
	};
	return (
		<div className="container">
			<h1>Simple Quiz</h1>
			{sentence < questions.length ? (
				<>
					<div className="multiple_choices">
						<h3>
							{sentence + 1}. {question?.question}
						</h3>
						<ul className="wrapper_answer">
							<li
								ref={Option1}
								onClick={(e) => handleCheckAns(e, 1)}
							>
								{question?.answer_A}
							</li>
							<li
								ref={Option2}
								onClick={(e) => handleCheckAns(e, 2)}
							>
								{question?.answer_B}
							</li>
							<li
								ref={Option3}
								onClick={(e) => handleCheckAns(e, 3)}
							>
								{question?.answer_C}
							</li>
							<li
								ref={Option4}
								onClick={(e) => handleCheckAns(e, 4)}
							>
								{question?.answer_D}
							</li>
						</ul>
					</div>
					<div className="box_btn">
						<button onClick={handleNext}>Next</button>
					</div>
				</>
			) : (
				<div>
					<h3>Kết quả {correct}/{questions.length}</h3>
					<div className="box_btn">
						<button onClick={handleAgain}>Play Again</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Text;
