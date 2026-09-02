import client from './client';
import type { Restaurant } from '../types';


export const fetchRestaurant = () => 
    client.get<Restaurant>('/public/restaurant').then((r) => r.data)
