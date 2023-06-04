import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Divider, Form, Input, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useLoginWithGoogleApi } from '@/api';
import { CarIllustrate } from '@/components';
import { useAuthStore } from '@/context/auth.context';
import { GoogleIcon } from '@/icons';
import { required } from '@/services';
import { showError } from '@/utils';

type SignInFormProps = Partial<{
  username: string;
  password: string;
}>;

export default function LoginPage() {
  const router = useRouter();

  const [, dispatch] = useAuthStore();

  const [form] = Form.useForm<SignInFormProps>();

  const { mutate: loginWithGoogle, isLoading: signingWithGoogle } =
    useLoginWithGoogleApi({
      onSuccess: (data) => {
        dispatch({
          type: 'SIGN_IN',
          payload: {
            user: {
              email: data.emailAddress,
              fullName: data.name,
              phone: data.phoneNumber,
            },
            accessToken: data.accessToken,
          },
        });

        router.push('/garages');
      },
      onError: showError,
    });

  const onLoginWithGoogle = useGoogleLogin({
    onSuccess: async (token) => {
      const { access_token } = token;

      loginWithGoogle({ params: { accessToken: access_token } });
    },
    onError: showError,
  });

  return (
    <div className="flex mt-20">
      <div className="relative w-3/5 min-h-[500px]">
        <CarIllustrate />
      </div>
      <div className="w-2/5 px-5 flex flex-col items-center">
        <Form form={form} className="max-w-md w-full">
          <Typography.Title className="mb-14" level={2}>
            Đăng nhập
          </Typography.Title>

          <Form.Item name="email" rules={[required()]}>
            <Input
              size="large"
              className="rounded-full shadow-md"
              placeholder="Email"
              suffix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item name="password" rules={[required()]}>
            <Input.Password
              size="large"
              className="rounded-full shadow-md"
              placeholder="Mật khẩu"
              suffix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item className="mt-14">
            <Button
              className="w-full rounded-full shadow-md"
              size="large"
              type="primary"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        <Button
          className="flex items-center gap-2 shadow-md w-full max-w-md rounded-full mb-3"
          size="large"
          onClick={() => onLoginWithGoogle()}
          loading={signingWithGoogle}
        >
          <GoogleIcon className="text-xl" />
          <span className="grow text-center">Đăng nhập với Google</span>
        </Button>

        <Link href="/forgot-password">
          <Typography.Text className="hover:text-primary hover:font-bold">
            Quên mật khẩu?
          </Typography.Text>
        </Link>

        <div className="max-w-md w-full">
          <Divider className="after:bg-slate-100 before:bg-slate-100 before:content-[''] after:content-['']">
            <Typography.Text>hoặc</Typography.Text>
          </Divider>
        </div>

        <Typography className="text-center">
          <span>Bạn chưa có tài khoản ?</span>{' '}
          <Link href="/sign-up" className="text-primary font-semibold">
            Đăng ký
          </Link>
        </Typography>
      </div>
    </div>
  );
}
