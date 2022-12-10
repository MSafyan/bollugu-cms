/*
	Imports
*/
import { Container } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import { defaultPerPage } from 'src/config/settings';
import bookingService from 'src/services/BookingServiceClass';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import MadarisList from './tables/MadarisList';
import OrdersList from './tables/OrdersList';

/*
	Main Working
*/
export default () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	const [pagination, setPagination] = useState({
		search: '',
		perPage: defaultPerPage,
		page: 0,
		order: 'desc',
		sort_by: 'id',
	});

	const [loading2, setLoading2] = useState(true);
	const [data2, setData2] = useState([]);
	const [pagination2, setPagination2] = useState({
		search: '',
		perPage: defaultPerPage,
		page: 0,
		order: 'desc',
		sort_by: 'id',
	});



	const getData = async () => {
		setLoading(true);
		const user = await userService.getLoggedInUser();
		bookingService
			.getActive(user.id, pagination)
			.then((booking) => {
				console.log("Booking", booking);
				setData(booking);
			})
			.catch((err) => {
				console.log("Well erorr", err.response);
				if (err.response) if (err.response.status === 401) navigate('/logout');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const getData2 = async () => {
		setLoading2(true);
		const user = await userService.getLoggedInUser();

		bookingService
			.getPast(user.id, pagination2)
			.then((booking) => {
				console.log("Booking", booking);
				setData2(booking);
			})
			.catch((err) => {
				console.log("Well erorr", err.response);
				if (err.response) if (err.response.status === 401) navigate('/logout');
			})
			.finally(() => {
				setLoading2(false);
			});
	};

	useEffect(getData, [pagination]);
	useEffect(getData2, [pagination2]);

	/*
	  Main Design
	*/
	return (
		<Page title="Orders">
			<Container>
				<ListPageTitle>
					Active Orders
				</ListPageTitle>
				{loading ? (
					<CenterLoading />
				) : (
					<OrdersList
						data={data}
						pagination={pagination}
						setPagination={setPagination}
						setLoading={setLoading}
						getData={getData}
					/>
				)}
				<br />
				<br />
				<ListPageTitle>
					Past Orders
				</ListPageTitle>
				{loading2 ? (
					<CenterLoading />
				) : (
					<OrdersList
						data={data2}
						pagination={pagination2}
						setPagination={setPagination2}
						setLoading={setLoading2}
						getData={getData2}
					/>
				)}
			</Container>
		</Page>
	);
};
