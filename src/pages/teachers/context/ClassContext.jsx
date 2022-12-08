/*
  Imports
*/
import equal from 'deep-equal';
import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import { DataReload } from 'src/config/settings';
import classService from 'src/services/ClassService';
import userService from 'src/services/UserService';

/*
    Context Handling
*/

export const ClassContext = createContext();

/*
    Main Working
*/
export const ClassProvider = () => {
  const [c, setClass] = useState({});
  const [loading, setLoading] = useState(true);
  const classID = useParams().cID;

  const navigate = useNavigate();

  const getData = async () => {
    const user = await userService.getLoggedInUser();
    setLoading(true);
    classService
      .find(classID)
      .then((data) => {
        setClass(data);
        if (data.teacher.id != user.id) navigate('/401');
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
        navigate('/404');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const silentReload = async () => {
    if (!classID) return;
    const user = await userService.getLoggedInUser();
    classService
      .find(classID)
      .then((data) => {
        if (data.teacher.id != user.id) return navigate('/401');
        if (!equal(data, c)) setClass(data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) navigate('/401');
          if (err.response.status === 404) navigate('/404');
        }
      });
  };
  useEffect(() => {
    getData();
    const reloadData = setInterval(silentReload, DataReload);
    return () => {
      clearInterval(reloadData);
    };
  }, []);
  return (
    <ClassContext.Provider value={{ c, reload: getData }}>
      {loading ? <CenterLoading /> : <Outlet />}
    </ClassContext.Provider>
  );
};
