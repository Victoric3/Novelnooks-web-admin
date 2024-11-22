import React from 'react';
import configData from '../../config.json';
import '../../Css/privacypolicy.css'


function TermsOfService() {
  

  return (
    <div className='container'>
      <h1 className='header'>
        Terms of Service
      </h1>
      <p>Effective Date: November 3, 2023</p>

      <h2 className='subheaderStyle'>1. Acceptance of Terms</h2>
      <p>
        By using {configData.Name} ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
      </p>

      <h2 className='subheaderStyle'>2. Use of the Service</h2>
      <p>
        You agree to use the Service in compliance with all applicable local, state, and federal laws, regulations, and ordinances. You also agree not to use the Service for any illegal or unauthorized purpose.
      </p>

      <h2 className='subheaderStyle'>3. User Account</h2>
      <p>
        To use certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and are liable for any activity that occurs under your account.
      </p>

      <h2 className='subheaderStyle'>4. Abusive Language and Decorum</h2>
      <p>
        Users are not allowed to use abusive or inappropriate language when answering questions or participating in the community. Maintaining decorum and respecting other users is essential. Failure to do so may result in the termination of your account.
      </p>

      <h2 className='subheaderStyle'>5. Prohibited Content</h2>
      <p>
        Users are strictly prohibited from posting NSFW (Not Safe for Work) content or any nude-related material on the platform. Violating this rule may result in the termination of your account.
      </p>

      <h2 className='subheaderStyle'>6. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
      </p>

      <h2 className='subheaderStyle'>7. Changes to Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Any changes will be posted on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
      </p>

      <h2 className='subheaderStyle'>8. Contact Us</h2>
      <p>
        If you have any questions or concerns about these Terms of Service, please contact us at <a href={`mailto:${configData.ContactEmail}`}>{configData.ContactEmail}</a>.
      </p>
    </div>
  );
}

export default TermsOfService;
