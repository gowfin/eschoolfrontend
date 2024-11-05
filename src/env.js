     // export const localhost = 'http://localhost:3005';
     // export const localhost = 'https://gowfinbackend.vercel.app'; //blessed
     // export const localhost = 'https://gowfinbackend.onrender.com'; //Macmay
          // export const localhosts = 'https://gowfin2hapibackend.vercel.app'; //helping hands
          export const getLocalhost = (companyName) => {
               if (companyName.toUpperCase() === 'BLESSED') {
                   return 'https://gowfinblessedmfibackend.vercel.app';
               }
               else if (companyName.toUpperCase() === '2HAPI') {
                    return 'https://gowfin2hapibackend.vercel.app';
                }
                else if (companyName.toUpperCase() === '/'  ) {
                    return 'https://gowfinbackend.onrender.com';
                }
                else if (companyName.toUpperCase() === '') {
                    return 'http://localhost:3005';
                    // return 'https://gowfinbackend.onrender.com';
                }
                else if (companyName.toUpperCase() === 'DUMMY') {
                    return 'http://localhost:3005';
                     // return 'https://gowfinbackend.onrender.com';
                }
                else {
                   return 'http://localhost:3005';
                   // return 'https://gowfinbackend.onrender.com';
               }
           };