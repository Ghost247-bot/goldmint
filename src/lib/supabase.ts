import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      },
    },
  },
  db: {
    schema: 'public'
  }
});

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Profile
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Products
export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Orders
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Investments
export const getAllInvestments = async () => {
  const { data, error } = await supabase
    .from('investments')
    .select(`
      *,
      product:products (name, category),
      profile:profiles (name, email)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Payment Methods
export const getAllPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deletePaymentMethod = async (id: string) => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const addPaymentMethod = async (paymentMethod: any) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert([paymentMethod])
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Users
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Addresses
export const getAllAddresses = async () => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Security Settings
export const getAllSecuritySettings = async () => {
  const { data, error } = await supabase
    .from('security_settings')
    .select(`
      *,
      profile:profiles (name, email)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Dashboard Data
export const getDashboardData = async () => {
  try {
    // Fetch total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Fetch orders with their items and products
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Calculate total revenue from orders
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    // Fetch active investments
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        *,
        product:products (name, category),
        profile:profiles (name, email)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (investmentsError) throw investmentsError;

    // Fetch wishlist count
    const { count: wishlistCount, error: wishlistError } = await supabase
      .from('wishlist')
      .select('*', { count: 'exact', head: true });

    if (wishlistError) throw wishlistError;

    // Fetch recent orders (last 5)
    const recentOrders = orders?.slice(0, 5) || [];

    return {
      totalUsers: totalUsers || 0,
      totalOrders: orders?.length || 0,
      totalRevenue,
      activeInvestments: investments?.length || 0,
      wishlistCount: wishlistCount || 0,
      recentOrders,
      investments
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Fetch All Data
export const getAllData = async () => {
  try {
    // Fetch all profiles/users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // Fetch all orders with their items and products
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Fetch all investments with related data
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        *,
        product:products (name, category),
        profile:profiles (name, email)
      `)
      .order('created_at', { ascending: false });

    if (investmentsError) throw investmentsError;

    // Fetch all payment methods
    const { data: paymentMethods, error: paymentMethodsError } = await supabase
      .from('payment_methods')
      .select('*')
      .order('created_at', { ascending: false });

    if (paymentMethodsError) throw paymentMethodsError;

    // Fetch all addresses
    const { data: addresses, error: addressesError } = await supabase
      .from('addresses')
      .select('*')
      .order('created_at', { ascending: false });

    if (addressesError) throw addressesError;

    // Fetch all security settings
    const { data: securitySettings, error: securitySettingsError } = await supabase
      .from('security_settings')
      .select(`
        *,
        profile:profiles (name, email)
      `)
      .order('created_at', { ascending: false });

    if (securitySettingsError) throw securitySettingsError;

    // Fetch all wishlist items
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products (*),
        profile:profiles (name, email)
      `)
      .order('created_at', { ascending: false });

    if (wishlistError) throw wishlistError;

    return {
      profiles,
      products,
      orders,
      investments,
      paymentMethods,
      addresses,
      securitySettings,
      wishlist,
      stats: {
        totalUsers: profiles?.length || 0,
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalRevenue: orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0,
        activeInvestments: investments?.filter(inv => inv.status === 'active').length || 0,
        totalPaymentMethods: paymentMethods?.length || 0,
        totalAddresses: addresses?.length || 0,
        totalWishlistItems: wishlist?.length || 0
      }
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};