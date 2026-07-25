import { createClient } from '@supabase/supabase-js'

// 1. Masukkan URL dan Key Anda secara langsung di dalam tanda kutip tunggal (' ')
const supabaseUrl = 'https://drqgvbppdopvibayrqgs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycWd2YnBwZG9wdmliYXlycWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MDU3NDMsImV4cCI6MjEwMDQ4MTc0M30.CL04n_Glu8UYtzf2byJhpR5B3ooJwUsKiXTOrsffvGg'

// 2. Jembatan Supabase siap digunakan
export const supabase = createClient(supabaseUrl, supabaseKey)