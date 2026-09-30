async function loginUser() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (!email || !password) {

        setAuthMessage(
            "Email dan password harus diisi."
        );

        return;
    }


    setAuthMessage(
        "Memeriksa akun...",
        true
    );


    try {

        // Batasi waktu login agar tidak macet selamanya
        const loginRequest =
            supabaseClient.auth
                .signInWithPassword({
                    email: email,
                    password: password
                });


        const timeout =
            new Promise((resolve) => {

                setTimeout(() => {

                    resolve({
                        data: null,
                        error: new Error(
                            "Koneksi ke Supabase terlalu lama."
                        )
                    });

                }, 15000);

            });


        const {
            data,
            error
        } =
            await Promise.race([
                loginRequest,
                timeout
            ]);


        // Jika login gagal
        if (error) {

            console.error(
                "Login error:",
                error
            );

            setAuthMessage(
                "Login gagal: " +
                error.message
            );

            return;
        }


        // Jika login berhasil
        if (data && data.user) {

            currentUser =
                data.user;


            // LANGSUNG masuk aplikasi
            enterApplication();


            // Muat data setelah aplikasi terbuka
            try {

                await createProfileIfNeeded();

                await initializeUserData();

            } catch (error) {

                console.error(
                    "Gagal memuat data pengguna:",
                    error
                );

                showToast(
                    "Login berhasil, tetapi sebagian data belum dapat dimuat."
                );

            }

        }


    } catch (error) {

        console.error(
            "Login exception:",
            error
        );

        setAuthMessage(
            "Terjadi kesalahan saat login: " +
            error.message
        );

    }

}