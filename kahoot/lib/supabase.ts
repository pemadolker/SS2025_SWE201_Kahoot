import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://srpuayytxfxedrjzpcab.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHVheXl0eGZ4ZWRyanpwY2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Mjg1MzgsImV4cCI6MjA2MjAwNDUzOH0.d9T-PCT0_jQTqRU5-24WhFHoJj0x1OWqULecAqumyxQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
