           // export const localhosts = 'https://gowfin2hapibackend.vercel.app'; //helping hands
          export const getLocalhost = (companyName) => {
               if (!companyName) {return "https://gowfinbackend.onrender.com";}
               else if (companyName.toUpperCase() === 'BLESSED') {
                 return 'https://gowfinblessedbackend.vercel.app';
                //   return 'http://localhost:3005';
                   
               }
               else if (companyName.toUpperCase() === 'MACMAY') {
                     return 'http://localhost:3005';
                //  return 'https://gowfinbackend.onrender.com';
            }
               else if (companyName.toUpperCase() === '2HAPI') {
                    return 'https://gowfin2hapibackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'RELIABLE') {
                    return 'https://gowfinreliablebackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'BRIGHTSTAR') {
                    return 'https://gowfinbrightstarbackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'IVYESSENTIAL') {
                    // return 'http://localhost:3005';
                    return 'https://gowfinivyessentialbackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'UKSTAR') {
                        // return 'http://localhost:3005';
                    return 'https://gowfinukstarbackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'BRILLIANT') {
                    return 'https://gowfinbrilliantbackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'DEMAYOR') {
                    return 'https://gowfindemayorbackend.vercel.app';
                }
                else if (companyName.toUpperCase() === 'PRESTIGE') {
                    // return 'http://localhost:3005';
                    return 'https://gowfinprestigebackend.vercel.app';
                }
                else if (companyName.toUpperCase() === '/'  ) {
                    return 'https://gowfinbackend.onrender.com';
                }
                else if (companyName.toUpperCase() === '') {
                    // return 'http://localhost:3005';
                     return 'https://gowfinbackend.onrender.com';
                }
                else if (companyName.toUpperCase() === 'DUMMY') {
                    // return 'http://localhost:3005';
                       return 'https://gowfinbackend.onrender.com';
                }
                else {
               //     return 'http://localhost:3005';
                return 'https://gowfinbackend.onrender.com';
               }
           };