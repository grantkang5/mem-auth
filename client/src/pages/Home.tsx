import React from 'react';
import { useMeQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
  const { data } = useMeQuery({ fetchPolicy: "network-only" });
  if (!data) return null;

  return (
    <div>{
      data && data.me ?
      <div>You are logged in as {data.me.email}</div>
        : <div>HOME</div>}
    </div>
  );
};

export default Home;
