import { createContext } from "react";
import PropTypes from "prop-types";
import { Questions } from "../data";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
	const vale = {
		Questions,
	};
	return (
		<ThemeContext.Provider value={vale}>{children}</ThemeContext.Provider>
	);
};

export {ThemeContext,ThemeProvider};

// Định nghĩa PropTypes cho component
ThemeProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

/*
Khi React component nhận props, định nghĩa các kiểu dữ liệu của các props đó để giúp đảm bảo tính nhất quán 
và tránh lỗi. Children là một prop đặc biệt đại diện cho các phần tử con được lồng bên trong 
component 
#children là một prop đặc biệt trong React, chứa các phần tử con được truyền vào bên trong component.
PropTypes.node là một kiểu dữ liệu được định nghĩa trong thư viện prop-types, cho biết
 children có thể là bất kỳ thứ gì mà React có thể render, bao gồm: số, chuỗi, phần tử
  hoặc mảng chứa các phần tử đó.
.isRequired được thêm vào để chỉ rõ rằng prop children là bắt buộc. 
Điều này có nghĩa là nếu children không được truyền vào component ThemeContext, 
React sẽ đưa ra cảnh báo (trong quá trình phát triển) về việc thiếu prop bắt buộc này.
*/
