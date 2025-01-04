'use client';

import { useEffect, useRef, useState } from "react";
import "./Quizizz.css";
import React from "react";
import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import cleanName from "../../../utils/clean";
import { getExamTitles } from "../../../utils/real_titles";
import { Tests } from "@prisma/client";


const Quizizz = () => {

	const router = useRouter()
	const { question } = useParams();
	const [sentence, setSentence] = useState(0);
	const [questions, setQuestions] = useState<Tests[]>([]);
	const [lock, setLock] = useState(false);
	const [correct,setCorrect]=useState(0);
	const [currentQuestion, setCurrentQuestion] = useState<Tests | null>(null);
	const [maxAvailable, setMaxAvailable] = useState(0);

	const Option1 = useRef<HTMLLIElement>(null);
	const Option2 = useRef<HTMLLIElement>(null);
	const Option3 = useRef<HTMLLIElement>(null);
	const Option4 = useRef<HTMLLIElement>(null);
	const Option5 = useRef<HTMLLIElement>(null);
	const Option6 = useRef<HTMLLIElement>(null);

	const Options = [Option1, Option2, Option3, Option4, Option5, Option6];

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await fetch(`/api/questions/${question}`);
				const data = await response.text();
				const jsonData = JSON.parse(data);
				jsonData.sort(() => Math.random() - 0.5);
				console.log(jsonData);
				setMaxAvailable(jsonData.length);
				setQuestions(jsonData.slice(0, 20));
				setCurrentQuestion(jsonData[sentence]);
			} catch (error) {
				console.error("Error fetching questions:", error);
			}
		};

		fetchQuestions();
	}, [question]);

	useEffect(() => {
		setCurrentQuestion(questions[sentence]);
	}, [sentence]);

	const handleCheckAns = (e, ans) => {
		if (lock === false) {
			if (ans === currentQuestion?.answer) {
				e.target.classList.add("correct");
				setLock(true);
				setCorrect(correct+1);
			} else {
				e.target.classList.add("wrong");
				if (currentQuestion && currentQuestion.answer !== undefined) {
					const correctOption = Options[currentQuestion.answer - 1]?.current;
					if (correctOption) {
						(correctOption as HTMLElement).classList.add("correct");
					}
				}
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
					if (item.current) {
						item.current.classList.remove("wrong");
						item.current.classList.remove("correct");
					}
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
			<h1 style={{textAlign: "center"}}>LactaQuiz</h1>
			<h2 style={{textAlign: "center"}}>{getExamTitles(Array.isArray(question) ? question[0] : question || "") || ""}</h2>
			{sentence < questions.length ? (
				<>
					<div className="multiple_choices">
						<h3>
							{sentence + 1}. {currentQuestion?.question}
						</h3>
						<ul className="wrapper_answer">
							<li
								ref={Option1}
								onClick={(e) => handleCheckAns(e, 1)}
							>
								{currentQuestion?.answer_A}
							</li>
							<li
								ref={Option2}
								onClick={(e) => handleCheckAns(e, 2)}
							>
								{currentQuestion?.answer_B}
							</li>
							<li
								ref={Option3}
								onClick={(e) => handleCheckAns(e, 3)}
							>
								{currentQuestion?.answer_C}
							</li>
							<li
								ref={Option4}
								onClick={(e) => handleCheckAns(e, 4)}
							>
								{currentQuestion?.answer_D}
							</li>
							<li
								ref={Option5}
								onClick={(e) => handleCheckAns(e, 5)}
							>
								{currentQuestion?.answer_E}
							</li>
							<li
								ref={Option6}
								onClick={(e) => handleCheckAns(e, 6)}
							>
								{currentQuestion?.answer_F}
							</li>
						</ul>
					</div>
					<div className="box_btn">
						<p>{sentence + 1} / {questions.length} (Total disponibles: {maxAvailable})</p>
						<p>Si hay mas de 20 tests disponibles, accediendo de nuevo al test o recargando la página, aparecerán nuevas preguntas</p>
					<button onClick={handleNext}>Siguiente</button>
					<br/>
					<button style={{backgroundColor: "darkred"}} onClick={() => {router.push('/')}}>Volver a la lista</button>
					</div>
				</>
			) : (
				<div>
					<h3 style={{ textAlign: "center" }}>Fin de test {correct}/{questions.length} ({((correct / questions.length) * 10).toPrecision(2)}/10)</h3>
					<div className="box_btn">
						<button onClick={() => {router.back()}}>Volver a la lista</button>
						<br/>
						<button onClick={handleAgain}>Reiniciar</button>

					</div>
				</div>
			)}
		</div>
	);
}

export default Quizizz

