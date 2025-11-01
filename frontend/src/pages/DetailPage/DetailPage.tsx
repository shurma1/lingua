import { useState } from "react";

import {Button, Typography} from "@maxhub/max-ui";

import PopupPageBase from "../../components/PopupPageBase/PopupPageBase";

import styles from "./DetailPage.module.scss";


// сгенерировано чатом жпт, НЕ ИСПОЛЬЗОВАТЬ В КАЧЕСТВЕ РЕФЕРЕНСА!!!
const DetailPage = () => {
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	return (
		<>
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.title}>
						<Typography.Headline variant="large-strong">Детальная страница</Typography.Headline>
					</div>
					<div className={styles.description}>
						<Typography.Body variant="medium">
							Это пример детальной страницы с вложенными popup окнами.
						</Typography.Body>
					</div>
					<div className={styles.content}>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Информация</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									Страница открывается справа с плавной анимацией и затемнением фона.
								</Typography.Body>
							</div>
						</div>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Навигация</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									Используйте кнопку "Назад" или свайп вправо для возврата на предыдущую страницу.
								</Typography.Body>
							</div>
							<Button
								className={styles.button}
								onClick={() => setIsInfoOpen(true)}
							>
								Открыть вложенный popup
							</Button>
						</div>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Особенности</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									TabBar скрыт на этой странице, что позволяет сфокусироваться на контенте.
								</Typography.Body>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PopupPageBase isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
				<div className={styles.page}>
					<div className={styles.container}>
						<div className={styles.title}>
							<Typography.Headline variant="large-strong">Вложенный Popup</Typography.Headline>
						</div>
						<div className={styles.description}>
							<Typography.Body variant="medium">
								Это вложенный popup поверх DetailPage. BackButton работает автоматически!
							</Typography.Body>
						</div>
						<div className={styles.content}>
							<div className={styles.card}>
								<div className={styles.cardTitle}>
									<Typography.Headline variant="medium-strong">История навигации</Typography.Headline>
								</div>
								<div className={styles.cardText}>
									<Typography.Body variant="medium">
										useHistory отслеживает все открытые окна и автоматически управляет BackButton.
									</Typography.Body>
								</div>
							</div>
						</div>
					</div>
				</div>
			</PopupPageBase>
		</>
	);
};

export default DetailPage;
