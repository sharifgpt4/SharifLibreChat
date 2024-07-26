// dataProvider.js
import config from "../config";

const apiUrl = `${config.api.host}/api`;

const httpClient = async (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('auth_token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return { data: await response.json(), headers: response.headers };
};

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      _page: page,
      _perPage: perPage,
      _sortField: field,
      _sortOrder: order,
      _filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}/get_all_${resource}?${new URLSearchParams(query)}`;

    const { data, headers } = await httpClient(url);
    return {
      data: data, // Assuming the backend response directly contains an array of user objects
      total: parseInt(headers.get('x-total-count'), 10),
    };
  },
  getOne: async (resource, params) => {
    const { data } = await httpClient(`${apiUrl}/${resource}/${params.id}`);
    return { data };
  },
  getMany: async (resource, params) => {
    const query = { _filter: JSON.stringify({ ids: params.ids }) };
    const { data } = await httpClient(
      `${apiUrl}/${resource}/get_many?${new URLSearchParams(query)}`,
    );
    return { data };
  },
  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      _page: page,
      _perPage: perPage,
      _sortField: field,
      _sortOrder: order,
      _filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
    };
    const url = `${apiUrl}/${resource}/get_many_reference?${new URLSearchParams(query)}`;
    const { data, headers } = await httpClient(url);
    return { data, total: parseInt(headers.get('x-total-count'), 10) };
  },
  update: async (resource, params) => {
    const { data } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(params.data),
    });
    return { data: { ...params.data, id: data.id } };
  },
  create: async (resource, params) => {
    const { data } = await httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(params.data),
    });
    return { data: data }; // Directly use the user object from the response
  },
  delete: async (resource, params) => {
    await httpClient(`${apiUrl}/${resource}/${params.id}`, { method: 'DELETE' });
    return { data: { id: params.id } };
  },
  // Implement updateMany and deleteMany if needed
};

export default dataProvider;
