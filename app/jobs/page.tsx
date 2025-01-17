'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './jobs.module.scss';
// import { PiDiamondsFour } from "react-icons/pi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLocationPin, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { formatSalary } from '../Ultils/formatSalary';
import Jobs_Skeleton from './job_skeleton';

import { Job } from '../interface/Job';
import { toast } from 'react-toastify';
import { showToastError, showToastSuccess } from '../Ultils/toast';
const apiUrl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
import FeedbackForm from '../pages/DefaultLayouts/FeedbackForm/FeedbackForm';

import SearchTypes from '../pages/Home/SearchTypes/page';

import { useHandleViewJob } from '../Ultils/hanle__viewJob';

function Jobs() {
    return (
        <section className={styles.job + ' marTop'}>
           <SearchTypes />

           <FeedbackForm />
        </section>
    );
}

export default Jobs;
