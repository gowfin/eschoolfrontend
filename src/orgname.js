            export const getOrgName = (companyName) => {
                if (!companyName) {return 'Macmay Group';}
                else if (companyName.toUpperCase() === 'BLESSED') {
                   return 'Blessed Women Microfinance';
               }
               else if (companyName.toUpperCase() === 'MACMAY') {
                return 'Macmay Group';
            }
            else if (companyName.toUpperCase() === 'CHANGINGLIFE') {
                return 'Changing Life For Better';
            }
            else if(companyName.toUpperCase() === 'THETOP'){ 
                return 'For The Top Nigeria Limited';
                
                }
            else if(companyName.toUpperCase() === 'SILVERLING'){ 
                    return 'Silverling Trust Empowerment Organization';
                    
                }
               else if (companyName.toUpperCase() === '2HAPI') {
                    return 'Helping hands for Active People Initiative';
                }
                else if (companyName.toUpperCase() === 'RELIABLE') {
                    return 'RELIABLE SUPPORT FOR COMMUNITY DEVELOPMENT';
                }
                else if (companyName.toUpperCase() === 'BRIGHTSTAR') {
                    return 'BRIGHT STARS EMPOWERMENT INITIATIVE';
                }
                else if (companyName.toUpperCase() === 'UKSTAR') {
                    return 'UKSTAR MICRO SERVICES';
                }
                else if (companyName.toUpperCase() === 'BRILLIANT') {
                    return 'BRILLIANT HOPE AND TOUCH EMPOWERMENT CENTRE';
                }
                else if (companyName.toUpperCase() === 'IVYESSENTIAL'  ) {
                    return 'IVY ESSENTIAL LIMITED';
                }
                else if (companyName.toUpperCase() === 'PRESTIGE'  ) {
                    return 'PRESTIGE SUPPORT SERVICES';
                }
                else if (companyName.toUpperCase() === 'DEMAYOR'  ) {
                    return 'DE MAYOR CORPORATE SERVICES LTD';
                }
                else if (companyName.toUpperCase() === '/'  ) {
                    return 'Macmay Group';
                }
                else if (companyName.toUpperCase() === '') {
                    return 'Macmay Group';
                    
                }
                else if (companyName.toUpperCase() === 'DUMMY') {
                    return 'Macmay Group';
                    
                }
                else {
                   return companyName;
                  
               }
           };