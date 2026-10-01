insert into ssr_mr07( SsrMr07M_BranchCode, SsrMr07M_PatientName,
         SsrMr07T_OrderHeaderID, SsrMr07T_OrderHeaderDate, SsrMr07T_OrderHeaderLabNumberExt,
         SsrMr07M_CompanyID,SsrMr07M_MouID,SsrMr07M_OmzetTypeID,
         SsrMr07Bruto, SsrMr07Netto,SsrMr07M_MouJpaIsNetto, 
         SsrMr07Price,SsrMr07M_StaffNIK, SsrMr07JpaName, SsrMr07JpaPercent,
         SsrMr07Jpa, SsrMr07M_No_FormRev)
         select
         DATE(T_OrderHeaderDate) = '2025-03-03', CONCAT(M_TitleName,' ',M_PatientName) AS M_PatientName,  
         T_OrderHeaderID, date(T_OrderHeaderDate) as tglorder, T_OrderHeaderLabNumberExt, 
         M_CompanyID, M_MouID, M_OmzetTypeID,
         sum(T_OrderDetailPrice) as bruto, sum(T_OrderDetailTotal) as netto, M_MouJpaIsNetto,
         if(M_MouJpaIsNetto = 'Y' ,sum(T_OrderDetailTotal) , sum(T_OrderDetailPrice) ) as harga,
         Nat_StaffNIK,
         M_MouJpa2Name as jpaname,	
         M_MouJpa2Percent as jpapersen,	
         if(M_MouJpaIsNetto = 'Y' ,
            sum(T_OrderDetailTotal)*(M_MouJpa2Percent/100) , 
            sum(T_OrderDetailPrice) *(M_MouJpa2Percent/100) )  as jpa, 
         M_No_FormRev 
         from t_orderheader
         join m_company on T_OrderHeaderM_CompanyID = M_CompanyID and M_CompanyIsActive = 'Y'
         join m_mou on T_OrderHeaderM_MouID = M_MouID  and M_MouIsActive = 'Y'
         join m_omzettype on M_MouM_OmzetTypeID = M_OmzetTypeID and  M_OmzetTypeIsActive = 'Y'
         join nat_staff on M_CompanyM_StaffID = Nat_StaffID and Nat_StaffIsActive = 'Y'
         -- left join f_payment on F_PaymentT_OrderHeaderID = T_OrderHeaderID  and  T_OrderHeaderIsActive = 'Y'
         left join m_patient ON T_OrderHeaderM_PatientID = M_PatientID  AND M_PatientIsActive = 'Y'
         left join m_title ON M_PatientM_TitleID = M_TitleID  AND M_TitleIsActive = 'Y' 
         left join t_orderdetail on T_OrderDetailT_OrderHeaderID = T_OrderHeaderID and  T_OrderDetailIsActive = 'Y'
         join t_test on T_OrderDetailT_TestID = T_TestID and T_TestIsPrice = 'Y'
         LEFT JOIN m_no_form on  M_No_FormID > 0 and M_No_FormName = 'INV' and M_No_FormIsActive = 'Y'
         left join  conf_systems on S_SystemsID > 0 
         where T_OrderHeaderIsActive = 'Y'
         and
         DATE(T_OrderHeaderDate) = '2025-03-03'
         and M_MouJpa2Name <> '' 
         group by T_OrderHeaderID
        having jpa <> '0'

union

select DATE(T_OrderHeaderDate) = '2025-03-03', CONCAT(M_TitleName,' ',M_PatientName) AS M_PatientName,  
         T_OrderHeaderID, date(T_OrderHeaderDate) as tglorder, T_OrderHeaderLabNumberExt, 
         M_CompanyID, M_MouID, M_OmzetTypeID,
         sum(T_OrderDetailPrice) as bruto, sum(T_OrderDetailTotal) as netto, M_MouJpaIsNetto,
         if(M_MouJpaIsNetto = 'Y' ,sum(T_OrderDetailTotal) , sum(T_OrderDetailPrice) ) as harga,
         Nat_StaffNIK,
         M_MouJpa2Name as jpaname,	
         M_MouJpa2Percent as jpapersen,	
         if(M_MouJpaIsNetto = 'Y' ,
            sum(T_OrderDetailTotal)*(M_MouJpa2Percent/100) , 
            sum(T_OrderDetailPrice) *(M_MouJpa2Percent/100) )  as jpa, 
         M_No_FormRev 
         from t_orderheader
         join m_company on T_OrderHeaderM_CompanyID = M_CompanyID and M_CompanyIsActive = 'Y'
         join m_mou on T_OrderHeaderM_MouID = M_MouID  and M_MouIsActive = 'Y'
         join m_omzettype on M_MouM_OmzetTypeID = M_OmzetTypeID and  M_OmzetTypeIsActive = 'Y'
         join nat_staff on M_CompanyM_StaffID = Nat_StaffID and Nat_StaffIsActive = 'Y'
         -- left join f_payment on F_PaymentT_OrderHeaderID = T_OrderHeaderID  and  T_OrderHeaderIsActive = 'Y'
         left join m_patient ON T_OrderHeaderM_PatientID = M_PatientID  AND M_PatientIsActive = 'Y'
         left join m_title ON M_PatientM_TitleID = M_TitleID  AND M_TitleIsActive = 'Y' 
           join t_orderdetail on T_OrderDetailT_OrderHeaderID = T_OrderHeaderID and  T_OrderDetailIsActive = 'Y'  and T_OrderDetailT_TestID = '0'
         LEFT JOIN m_no_form on  M_No_FormID > 0 and M_No_FormName = 'INV' and M_No_FormIsActive = 'Y'
         left join  conf_systems on S_SystemsID > 0 
         where T_OrderHeaderIsActive = 'Y'
         and
         DATE(T_OrderHeaderDate) = '2025-03-03'
         and M_MouJpa2Name <> '' 
         group by T_OrderHeaderID
         having jpa <> '0'"