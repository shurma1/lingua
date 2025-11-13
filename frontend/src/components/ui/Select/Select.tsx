import { useState, useEffect, useRef } from "react";

import styles from "../../../styles/components/ui/Select.module.scss";

interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
	options,
	placeholder = "Select an option",
	value,
	onChange,
	disabled = false,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((option) => option.value === value);

	const handleToggle = () => {
		if (!disabled) {
			setIsOpen((prev) => !prev);
		}
	};

	const handleSelect = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div
			ref={selectRef}
			className={`${styles.select} ${disabled ? styles.disabled : ""} ${className}`}
		>
			<div
				className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
				onClick={handleToggle}
			>
				<span className={selectedOption ? styles.selectedValue : styles.placeholder}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
			</div>

			{isOpen && (
				<div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}>
					{options.map((option) => (
						<div
							key={option.value}
							className={`${styles.option} ${
								option.value === value ? styles.optionSelected : ""
							}`}
							onClick={() => handleSelect(option.value)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Select;
