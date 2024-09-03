document.addEventListener("DOMContentLoaded", function() {

  // Mendapatkan nama tamu dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('nama') || 'Tamu Spesial';
  document.getElementById('guest-name').textContent = guestName;

  // Membuka isi undangan ketika tombol diklik
  document.getElementById('open-invitation').addEventListener('click', function() {
      document.querySelector('.cover').style.display = 'none';
      document.getElementById('invitation-content').style.display = 'block';
  });

  // Array dari gambar latar belakang
  const backgrounds = [
      'url("gallery1.jpeg")',
      'url("gallery3.jpeg")',
      'url("gallery4.jpeg")',
      'url("gallery5.jpeg")'
  ];

  let currentBackgroundIndex = 0;
  const section1 = document.getElementById('section1');

  // Fungsi untuk mengganti background
  function changeBackground() {
      section1.style.backgroundImage = backgrounds[currentBackgroundIndex];
      currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
  }

  // Ganti background setiap 2 detik
  setInterval(changeBackground, 2000);

  // Countdown timer
  const targetDate = new Date('2024-09-15T00:00:00');

  function updateCountdown() {
      const now = new Date();
      const timeDiff = targetDate - now;

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  // Update the countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Initialize countdown

  // Lightbox for gallery images
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const images = document.querySelectorAll('.gallery-item img');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentIndex = 0;

  function showLightbox(index) {
      lightbox.style.display = 'flex';
      lightboxImage.src = images[index].src;
      currentIndex = index;
  }

  function closeLightbox() {
      lightbox.style.display = 'none';
  }

  function showNextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImage.src = images[currentIndex].src;
  }

  function showPrevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImage.src = images[currentIndex].src;
  }

  images.forEach((img, index) => {
      img.addEventListener('click', () => showLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNextImage);
  prevBtn.addEventListener('click', showPrevImage);

  // Close the lightbox when clicking outside the image
  lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
          closeLightbox();
      }
  });

  // Fungsi untuk menyalin nomor rekening ke clipboard
  const copyButton = document.getElementById('copy-button');
  const accountNumber = document.getElementById('account-number');

  copyButton.addEventListener('click', function() {
      const tempInput = document.createElement('input');
      tempInput.value = accountNumber.textContent;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      // Memberikan feedback bahwa teks telah disalin
      copyButton.textContent = 'Copied!';
      setTimeout(function() {
          copyButton.textContent = 'Copy';
      }, 2000);
  });

  // Fungsi untuk menampilkan pesan RSVP
  function fetchMessages() {
      fetch('https://zhapran-fira-tema-2.glitch.me/rsvp')
          .then(response => response.json())
          .then(data => {
              const messagesContainer = document.getElementById('messages');
              messagesContainer.innerHTML = '';
              data.forEach(message => {
                  const messageElement = document.createElement('div');
                  messageElement.classList.add('message-item');
                  messageElement.innerHTML = `
                      <h4>${message.name}</h4>
                      <p>${message.message}</p>
                      <p class="attendance-status">${message.attendance}</p>
                  `;
                  messagesContainer.appendChild(messageElement);
              });
          });
  }

  // Fungsi untuk menampilkan jumlah kehadiran
  function fetchAttendanceCounts() {
      fetch('https://zhapran-fira-tema-2.glitch.me/rsvp/attendance')
          .then(response => response.json())
          .then(data => {
              document.getElementById('hadirCount').textContent = data.hadir;
              document.getElementById('tidakHadirCount').textContent = data.tidakHadir;
              document.getElementById('raguCount').textContent = data.ragu;
          });
  }

  // Event listener untuk form submit
  const rsvpForm = document.getElementById('rsvpForm');
  const responseMessage = document.getElementById('responseMessage');

  rsvpForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Mencegah halaman refresh

      const name = document.getElementById('name').value;
      const message = document.getElementById('message').value;
      const attendance = document.getElementById('attendance').value;

      // Mengirim data ke server Glitch
      fetch('https://zhapran-fira-tema-2.glitch.me/rsvp', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, message, attendance })
      })
      .then(response => response.json())
      .then(data => {
          responseMessage.textContent = `Terima kasih, ${name}! Pesan Anda telah diterima: "${message}"`;
          rsvpForm.reset(); // Reset form setelah submit
          fetchMessages(); // Refresh daftar RSVP dan jumlah kehadiran
          fetchAttendanceCounts();
      })
      .catch(error => {
          responseMessage.textContent = 'Terjadi kesalahan, coba lagi nanti.';
          console.error('Error:', error);
      });
  });

  // Panggil fetchMessages dan fetchAttendanceCounts saat halaman pertama kali dimuat
  fetchMessages();
  fetchAttendanceCounts();

  // function to show animation 
  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const elements = document.querySelectorAll('.fade-in, .fade-slide');

  elements.forEach(element => {
      observer.observe(element);
  });

  
});
