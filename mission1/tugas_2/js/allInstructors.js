function setInstructors(img_source){
    let container = document.getElementById("instructors-sections");
    let div_1 = document.createElement('div');
    div_1.className = "col-md-6";
    let div_2 = document.createElement('div');
    div_2.className = "row profile pe-4";
    let div_3 = document.createElement('div');
    div_3.className = 'col-md-3'

    container.appendChild(div_1);
    div_1.appendChild(div_2);
    div_2.appendChild(div_3);

    let img = document.createElement('img');
    img.src = img_source;
    img.alt = "Photo Instructor"
    
    div_3.appendChild(img);

    let div_4 = document.createElement('div');
    div_4.className = "col-md-9";
    let div_5 = document.createElement('div');
    div_5.className = "row name";
    let div_6 = document.createElement('div');
    div_6.className = "row description";
    div_6.textContent = 'Salah satu mahasiswa kelas 3B - D4 Teknik Informatika di Politeknik Negeri Bandung.'

    let filenameWithoutExtensions = img_source.split('/').pop().split('.')[0];
    div_5.textContent = filenameWithoutExtensions;

    div_2.appendChild(div_4);
    div_4.appendChild(div_5);
    div_4.appendChild(div_6);
    
}

const imgFileNames = [
    "Aini Diah Rahmawati",
    "Aini Nurul Azizah",
    "Amelia Nathasa",
    "Azis Surohman",
    "Danu Mahesa",
    "Dea Salma Isnaini",
    "Delvito Rahim Derivansyah",
    "Egi Satria Dharma Yudha Wicaksana",
    "Falia Davina Gustaman",
    "Ghessa Theniana",
    "Gian Sandrova",
    "Helsa Alika Femiani",
    "Husna Maulana",
    "Jovan Shelomo",
    "Mentari Ayu Alysia Sudrajat",
    "Mey Meizia Galtiady",
    "Mochamad Ferdy Fauzan",
    "Muhammad Daffa Raihandika",
    "Muhammad Rafi Farhan",
    "Nayara Saffa",
    "Novia Nur Azizah",
    "Rachmat Purwa Saputra",
    "Rahma Alia Latifa",
    "Raka Mahardika Maulana",
    "Regi Purnama",
    "Reihan Hadi Fauzan",
    "Reza Ananta Permadi Supriyo",
    "Rivaldo Fauzan Robani",
    "Rofa'ul Akrom Hendrawan",
    "Sendi Setiawan",
    "Syifa Khairina",
    "Yasmin Azizah Tuhfah"
];

// Loop through the image file names and call the function for each, up to 12 times
for (const fileName of imgFileNames) {
    const imgPath = `assets/img/instructors/${fileName}.jpg`;
    setInstructors(imgPath);
}