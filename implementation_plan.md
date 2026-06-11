# Rencana Implementasi: Pembaruan Panel Admin Portofolio

Rencana ini merinci pembaruan arsitektur dan visual panel admin pada [AdminPage](file:///c:/project%20ican/portfolio/src/app/admin/page.tsx) dan komponen pendukungnya di [components](file:///c:/project%20ican/portfolio/src/app/admin/components).

---

## User Review Required

> [!IMPORTANT]
> **Penyimpanan Storage Supabase:**
> Semua file gambar/dokumen baru (Foto Profil About, CV PDF, Ikon Skill, Gambar Sertifikat) akan diunggah ke bucket **`Hero`** di Supabase (seperti yang digunakan oleh HeroTab saat ini) dengan penamaan berawalan unik (`about_profile_*`, `about_cv_*`, `skills_*`, `certs_*`). Hal ini menghindari kegagalan otorisasi pembuatan bucket baru di Supabase.

---

## Proposed Changes

Kami akan memperbarui dan mengintegrasikan pustaka berikut:
- **`@headlessui/react` (v2.2.10)**: Menggantikan `<select>` bawaan HTML menjadi dropdown kustom premium.
- **`@tanstack/react-query` (v5.99.2)**: Mengelola state sinkronisasi, caching agar berpindah tab instan tanpa reload, serta Optimistic Updates untuk mutasi database.

### 1. Inisialisasi React Query & Wrapper Provider
#### [NEW] [QueryProvider](file:///c:/project%20ican/portfolio/src/app/admin/components/QueryProvider.tsx)
- Membuat komponen client provider untuk inisialisasi `QueryClient` dengan konfigurasi:
  ```typescript
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // Data dianggap segar selama 10 menit (mencegah loading ulang saat pindah tab)
      gcTime: 1000 * 60 * 30, // Disimpan dalam memori selama 30 menit
      refetchOnWindowFocus: false,
    }
  }
  ```
- Membungkus admin layout atau admin page dengan provider ini.

---

### 2. Komponen Dropdown Headless UI & Skeleton Loaders
#### [NEW] [CustomDropdown](file:///c:/project%20ican/portfolio/src/app/admin/components/CustomDropdown.tsx)
- Komponen dropdown modern menggunakan `Listbox`, `ListboxButton`, `ListboxOptions`, dan `ListboxOption` dari `@headlessui/react`.
- Dilengkapi dengan micro-animations, hover effects, indikator tanda centang (✓), dan transisi halus.

#### [NEW] [SkeletonLoaders](file:///c:/project%20ican/portfolio/src/app/admin/components/SkeletonLoaders.tsx)
- Menyediakan skeleton loaders modern yang menyerupai bentuk form/konten asli untuk masing-masing tab:
  - **Form Skeleton**: Baris-baris input berbayang untuk Hero, About, dan Contact.
  - **Grid Card Skeleton**: Kerangka kartu untuk Skills, Projects, dan Certificates.

---

### 3. Penyelarasan Layout Sidebar & Mobile Menu Responsive
#### [MODIFY] [page.tsx](file:///c:/project%20ican/portfolio/src/app/admin/page.tsx)
- **Penyelarasan Sidebar**: Menyesuaikan padding container sehingga sidebar sejajar secara vertikal dengan awal teks/logo navbar "MUHAMAD IKHSAN".
- **Menu Mobile Responsive**:
  - Pada layar mobile (`lg` ke bawah), ganti sidebar scroll horizontal dengan tombol drawer menu mobile.
  - Ketika diklik, akan membuka Drawer Slide-Over/Overlay modern menggunakan dialog Headless UI atau Framer Motion yang menampilkan daftar menu.
- **Integrasi React Query**:
  - Mengganti pemanggilan manual `fetchAllData` di `useEffect` dengan hook `useQuery` untuk masing-masing tabel database.
  - Mengelola loading state global sehingga skeleton loader hanya muncul sekali saat memuat data pertama kali.

---

### 4. Integrasi Optimistic Updates & Image Upload pada Komponen Form

Semua operasi tambah, ubah, dan hapus akan menggunakan hook `useMutation` dari React Query dengan strategi **Optimistic Updates** (mengubah cache langsung secara lokal, melakukan rollback jika API error, dan melakukan invalidasi query untuk sinkronisasi akhir).

#### [MODIFY] [HeroTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/HeroTab.tsx)
- Diperbarui agar terhubung dengan React Query mutation untuk menyimpan perubahan Hero.
- Membawa style tombol simpan & dialog konfirmasi progress bar yang modern sebagai acuan untuk tab lain.

#### [MODIFY] [AboutTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/AboutTab.tsx)
- **Unggah Gambar & File**: Mengganti kolom teks `profile_image_url` dengan pemilih file gambar profil yang dinamis (Preview, Ganti, Hapus).
- Kolom `cv_url` diperbarui untuk mendukung unggah file dokumen CV (PDF/Doc) langsung ke Supabase Storage.
- Menggunakan tombol simpan bergaya HeroTab lengkap dengan modal konfirmasi dan bar progress.
- Mengintegrasikan hook `useMutation` dengan Optimistic Updates.

#### [MODIFY] [SkillsTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/SkillsTab.tsx)
- **Unggah Logo**: Mendukung unggah logo SVG/PNG ke storage daripada memasukkan teks URL mentah.
- Menggantikan select kategori dengan `@headlessui/react` Listbox dropdown.
- Menggunakan modal konfirmasi dan progress bar saat submit.
- Mengintegrasikan Optimistic Updates untuk mutasi CRUD.

#### [MODIFY] [ProjectsTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/ProjectsTab.tsx)
- Menggantikan select icon tipe dengan `@headlessui/react` Listbox dropdown.
- Menggunakan modal konfirmasi dan progress bar saat submit.
- Mengintegrasikan Optimistic Updates untuk mutasi CRUD.

#### [MODIFY] [CertificatesTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/CertificatesTab.tsx)
- **Unggah Gambar**: Mengganti input URL gambar sertifikat menjadi pemilih file gambar dengan preview.
- Menggantikan select icon tipe dengan `@headlessui/react` Listbox dropdown.
- Menggunakan modal konfirmasi dan progress bar saat submit.
- Mengintegrasikan Optimistic Updates untuk mutasi CRUD.

#### [MODIFY] [SocialsTab.tsx](file:///c:/project%20ican/portfolio/src/app/admin/components/SocialsTab.tsx)
- Menggantikan select icon sosial dengan `@headlessui/react` Listbox dropdown.
- Menggunakan modal konfirmasi dan progress bar saat submit.
- Mengintegrasikan Optimistic Updates untuk mutasi CRUD.

---

## Verification Plan

### Automated Verification
- Menjalankan `pnpm build` untuk memastikan tidak ada kesalahan TypeScript atau compile-time Next.js.

### Manual Verification
1. Membuka panel admin, mengecek skeleton loader saat pertama kali dimuat.
2. Berpindah antar tab admin untuk memastikan tidak ada spinner/skeleton berkedip (instant loading dari cache).
3. Melakukan upload foto profil di tab About, sertifikat di tab Certificates, logo di tab Skills, dan memastikan file terunggah sukses ke storage.
4. Memvalidasi dropdown Headless UI baru bekerja responsif.
5. Menguji tampilan mobile dan fungsi Drawer menu navigasi.
6. Memvalidasi bahwa mutasi berjalan instan di UI (Optimistic Updates) dan ter-update di database.
