import React, { useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import { useInfiniteQuery } from '@tanstack/react-query'
import { getFakeUsers } from '../../api';
import InfiniteScroll from 'react-infinite-scroll-component';

// ref: https://stackoverflow.com/questions/40958727/javascript-generate-unique-number-based-on-string
const generateRandomId = (input: string): string => {
  let hashNumber = 0;
  const len = input.length;

  for (let i = 0; i < len; i++) {
    hashNumber = ((hashNumber << 5) - hashNumber) + input.charCodeAt(i);
    hashNumber |= 0; // to 32bit integer
  }

  return String(Math.abs(hashNumber));
}

type UsersResponse = {
  info: {
    page: number;
    results: number;
  }
  results: {
    name: {
      title: string;
      first: string;
      last: string;
    };
    location: {
      street: {
        name: string;
        number: number;
      };
      postcode: number;
      city: string;
      country: string;
    };
    cell: string
  }[]
}

interface Props {
  seed: string | '',
  region: string | ''
};

function UserTable(props: Props) {
  const { isLoading, error, data, refetch, fetchNextPage } = useInfiniteQuery<UsersResponse>(['users', props.seed, props.region],
    ({ pageParam }) => getFakeUsers(props.seed, props.region, pageParam + 1), {
    enabled: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      return lastPage.info.page + 1;
    }
  });

  const usersData = useMemo(() => {
    const allResults = data?.pages?.reduce<UsersResponse['results']>((acc, page) => {
      return acc.concat(page.results);
    }, []);

    return allResults?.map((user, index) => {
      const name = `
        ${user.name.title} 
        ${user.name.first} 
        ${user.name.last}
      `;
      const address = `
        ${user.location.street.name}
        ${user.location.street.number}, 
        ${user.location.postcode} 
        ${user.location.city}, 
        ${user.location.country}
      `;

      const numbers = `${user.cell}`;
      const randomId = generateRandomId(name + address + numbers).slice(0, 12)

      return {
        id: randomId,
        name,
        numbers,
        address
      };
    })

  }, [data]);

  const handleUserGenerate = () => {
    refetch();
  }

  const handleFetchMore = () => {
    fetchNextPage();
  }

  return (
    <>
      <div className="d-grid gap-2">
        <Button
          size="lg"
          disabled={!props.seed || !props.region}
          type='button'
          onClick={handleUserGenerate}
        >
          Generate users
        </Button>
        {usersData && usersData.length > 0 && <InfiniteScroll
          dataLength={usersData?.length || 0}
          next={handleFetchMore}
          hasMore={true}
          loader={isLoading ? "loading" : ""}
        >
          <Table striped bordered hover size="sm" id="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Random ID</th>
                <th>Name</th>
                <th>Adress</th>
                <th>Phone number</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.address}</td>
                  <td>{user.numbers}</td>
                </tr>
              )))}
            </tbody>
          </Table>
        </InfiniteScroll>}

      </div>
    </>
  )
};

export default UserTable;