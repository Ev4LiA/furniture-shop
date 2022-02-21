import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';

const filter_reducer = (state, { type, payload }) => {
  switch (type) {
    case LOAD_PRODUCTS: {
      let maxPrice = payload.map((p) => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        filtered_products: [...payload],
        all_products: [...payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };
    }

    case SET_GRIDVIEW: {
      return { ...state, grid_view: true };
    }

    case SET_LISTVIEW: {
      return { ...state, grid_view: false };
    }

    case UPDATE_SORT: {
      return { ...state, sort: payload };
    }

    case SORT_PRODUCTS: {
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === 'price-lowest') {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }

      if (sort === 'price-highest') {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }

      if (sort === 'name-a') {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }

      if (sort === 'name-z') {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }

      return { ...state, filtered_products: tempProducts };
    }

    case UPDATE_FILTERS: {
      const { name, value } = payload;
      return { ...state, filters: { ...state.filters, [name]: value } };
    }

    case FILTER_PRODUCTS: {
      const { all_products } = state;
      const { text, category, company, color, price, shipping } = state.filters;

      // Always start with fresh list of product before filtering
      let tempProducts = [...all_products];

      // filtering function
      if (text) {
        tempProducts = tempProducts.filter((item) => {
          return item.name.toLowerCase().startsWith(text);
        });
      }

      if (category !== 'all') {
        tempProducts = tempProducts.filter((item) => {
          return item.category === category;
        });
      }

      if (company !== 'all') {
        tempProducts = tempProducts.filter((item) => {
          return item.company === company;
        });
      }

      if (color !== 'all') {
        tempProducts = tempProducts.filter((item) => {
          return item.colors.find((c) => c === color);
        });
      }

      tempProducts = tempProducts.filter((item) => {
        return item.price <= price;
      });

      if (shipping) {
        tempProducts = tempProducts.filter((item) => {
          return item.shipping === true;
        });
      }

      return { ...state, filtered_products: tempProducts };
    }

    case CLEAR_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          text: '',
          company: 'all',
          category: 'all',
          color: 'all',
          price: state.filters.max_price,
          shipping: false,
        },
      };
    }

    default:
      return state;
  }
};

export default filter_reducer;
